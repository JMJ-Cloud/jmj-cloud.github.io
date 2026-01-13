---
title: "Code your own PL/SQL HMAC-SHA1 function"
date: 2017-09-02
author: "Jon Dixon"
tags: ["PL/SQL", "Security", "HMAC", "SHA1", "OAuth", "Exadata Express"]
summary: "JMJ Cloud documented a solution for implementing HMAC-SHA1 signatures in Oracle's Exadata Express, which lacks the DBMS_CRYPTO package available in Enterprise editions."
---

JMJ Cloud documented a solution for implementing HMAC-SHA1 signatures in Oracle's Exadata Express, which lacks the `DBMS_CRYPTO` package available in Enterprise editions.

![HMAC-SHA1 PL/SQL](/images/blog/hmac-sha1-plsql/plsql-hmac-sha1-min.png)

## The Problem

We needed to call OAuth 1.0-authenticated web services (like QuickBooks) from Exadata Express. These services require HMAC-SHA1 signature generation for request authentication.

Normally, you would use the built-in `DBMS_CRYPTO.mac()` function:

```sql
l_signature := DBMS_CRYPTO.mac(
    src => UTL_RAW.cast_to_raw(l_base_string),
    typ => DBMS_CRYPTO.hmac_sh1,
    key => UTL_RAW.cast_to_raw(l_signing_key)
);
```

However, Exadata Express doesn't provide the `DBMS_CRYPTO` package. Additionally, Java stored procedures aren't supported, eliminating that workaround option.

## The Solution

We created a custom PL/SQL implementation based on RFC 2104 standards. The approach involved two components:

### Component 1: SHA1 Hashing

For the SHA1 hash function, we leveraged an open-source package from GitHub (vadimonus/plsql-hash). This provides a pure PL/SQL implementation of SHA1 hashing.

### Component 2: HMAC Implementation

We built an `hmac_sha1()` function following the HMAC-SHA1 specification:

```sql
CREATE OR REPLACE FUNCTION hmac_sha1(
    p_key     IN VARCHAR2,
    p_message IN VARCHAR2
) RETURN VARCHAR2
IS
    c_block_size CONSTANT PLS_INTEGER := 64;
    l_key        RAW(64);
    l_ipad       RAW(64);
    l_opad       RAW(64);
    l_inner_hash RAW(20);
    l_result     RAW(20);
BEGIN
    -- Step 1: Prepare the key
    -- If key is longer than block size, hash it first
    IF LENGTH(p_key) > c_block_size THEN
        l_key := sha1_raw(UTL_RAW.cast_to_raw(p_key));
    ELSE
        l_key := UTL_RAW.cast_to_raw(p_key);
    END IF;

    -- Pad key to block size with zeros
    l_key := UTL_RAW.concat(
        l_key,
        UTL_RAW.copies(hextoraw('00'), c_block_size - UTL_RAW.length(l_key))
    );

    -- Step 2: Create inner and outer padding
    -- XOR key with 0x36 (ipad) and 0x5c (opad)
    l_ipad := UTL_RAW.bit_xor(l_key, UTL_RAW.copies(hextoraw('36'), c_block_size));
    l_opad := UTL_RAW.bit_xor(l_key, UTL_RAW.copies(hextoraw('5c'), c_block_size));

    -- Step 3: Inner hash = SHA1(ipad || message)
    l_inner_hash := sha1_raw(
        UTL_RAW.concat(l_ipad, UTL_RAW.cast_to_raw(p_message))
    );

    -- Step 4: Outer hash = SHA1(opad || inner_hash)
    l_result := sha1_raw(
        UTL_RAW.concat(l_opad, l_inner_hash)
    );

    RETURN RAWTOHEX(l_result);
END hmac_sha1;
```

The HMAC algorithm follows these steps:

1. **Key preparation**: If the key is longer than 64 bytes, hash it first. Pad the key with zeros to exactly 64 bytes.

2. **Inner padding (ipad)**: XOR the padded key with 0x36 repeated 64 times.

3. **Outer padding (opad)**: XOR the padded key with 0x5c repeated 64 times.

4. **Inner hash**: Compute SHA1 of (ipad concatenated with message).

5. **Final hash**: Compute SHA1 of (opad concatenated with inner hash result).

## Testing

We validated the solution against RFC test cases and Wikipedia examples:

```sql
-- Test case 1: Empty string
SELECT hmac_sha1('key', '') FROM dual;
-- Expected: f42bb0eeb018ebbd4597ae7213711ec60760843f

-- Test case 2: Standard message
SELECT hmac_sha1('key', 'The quick brown fox jumps over the lazy dog') FROM dual;
-- Expected: de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9

-- Test case 3: Long key (requires pre-hashing)
SELECT hmac_sha1(
    RPAD('k', 100, 'k'),
    'message'
) FROM dual;
```

All test cases confirmed accuracy of the implementation.

## Usage for OAuth 1.0

With the HMAC-SHA1 function in place, you can generate OAuth signatures:

```sql
DECLARE
    l_base_string  VARCHAR2(4000);
    l_signing_key  VARCHAR2(500);
    l_signature    VARCHAR2(100);
BEGIN
    -- Build the signature base string per OAuth spec
    l_base_string := 'POST&' ||
        UTL_URL.escape('https://api.example.com/resource', TRUE) || '&' ||
        UTL_URL.escape('oauth_params...', TRUE);

    -- Signing key = consumer_secret&token_secret
    l_signing_key := 'consumer_secret' || '&' || 'token_secret';

    -- Generate signature
    l_signature := UTL_ENCODE.base64_encode(
        UTL_RAW.cast_to_raw(hmac_sha1(l_signing_key, l_base_string))
    );
END;
```

## Current Status

The authors note that Oracle has since included `DBMS_CRYPTO` with Exadata Express, making this custom implementation less necessary for that platform. However, the custom implementation remains useful for:

- Non-Enterprise database editions without `DBMS_CRYPTO`
- Environments where you can't install additional packages
- Learning purposes to understand how HMAC actually works

## Conclusion

When standard Oracle packages aren't available, pure PL/SQL implementations can fill the gap. The HMAC-SHA1 algorithm, while complex, is implementable entirely in PL/SQL using RAW data types and bitwise operations.

This solution enabled us to integrate with OAuth 1.0 services from Exadata Express until Oracle added native support.

---

Jon Dixon, Co-Founder JMJ Cloud
