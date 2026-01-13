---
title: "Upgrading ORDS from 3.0.5 to 3.0.7"
date: 2016-10-01
author: "Jon Dixon"
tags: ["ORDS", "Upgrade", "GlassFish", "Administration"]
summary: "This post provides guidance on performing an in-place upgrade of ORDS from version 3.0.5 to 3.0.7 within GlassFish."
---

This post provides guidance on performing an in-place upgrade of ORDS from version 3.0.5 to 3.0.7 within GlassFish.

![ORDS Upgrade](/images/blog/upgrading-ords/ords-upgrade.png)

## Important Note

ORDS 2.X is fundamentally different to ORDS 3.X. This example doesn't apply to 2.X to 3.X migrations, which require a more comprehensive upgrade process.

## Backups and Precautions

Before upgrading, back up the following:

1. **Current ords.war file** - In case you need to rollback
2. **ORDS config directory contents** - For example: `/srv/ords/config`
3. **REST service modules, templates, and handlers** - Export using SQL Developer or scripts

```bash
# Example backup commands
cp /srv/ords/ords.war /srv/ords/backup/ords.war.305
cp -r /srv/ords/config /srv/ords/backup/config.305
```

## Review Release Notes

Review the readme.html file for version-specific requirements. Version 3.0.7 requires setting `security.requestValidationFunction` to `WWV_FLOW_EPG_INCLUDE_MODULES.AUTHORIZE` for APEX_PUBLIC_USER configurations.

Add this to your defaults.xml if not already present:

```xml
<entry key="security.requestValidationFunction">
  WWV_FLOW_EPG_INCLUDE_MODULES.AUTHORIZE
</entry>
```

## Upgrade Steps

### Step 1: Download Latest ORDS Version

Download the latest ORDS version from Oracle Technology Network.

### Step 2: Extract and Copy WAR File

Extract the download and copy the ords.war file, overwriting the existing file:

```bash
unzip ords-3.0.7.zip
cp ords-3.0.7/ords.war /srv/ords/ords.war
```

### Step 3: Run the Installer

Run the installer to upgrade the database schema:

```bash
cd /srv/ords
java -jar ords.war install
```

### Step 4: Provide Configuration Details

When prompted, provide the config directory location:

```
Enter the location to store configuration data: /srv/ords/config
```

### Step 5: Enter SYS Credentials

Enter SYS credentials for schema verification. The installer will validate and upgrade the ORDS metadata schema in the database.

### Step 6: Automatic Schema Upgrade

ORDS automatically upgrades the database schema. You'll see messages indicating the upgrade progress:

```
Upgrading ORDS metadata schema...
Done.
```

### Step 7: Redeploy the WAR File

Redeploy the WAR file in GlassFish:

1. Log into GlassFish Admin Console
2. Navigate to Applications
3. Select ords application
4. Click Redeploy
5. Upload the new ords.war file
6. Click OK

Alternatively, use the command line:

```bash
asadmin redeploy --name ords /srv/ords/ords.war
```

## Verification

Query the ORDS version to confirm the upgrade:

```sql
SELECT * FROM ords_metadata.ords_version;
```

Expected output:

```
VERSION
-------
3.0.7
```

You can also check the version via REST:

```bash
curl https://your-server/ords/
```

## Multi-Instance Upgrades

If you have multiple ORDS instances (e.g., development, test, production):

1. Upgrade development first
2. Test thoroughly
3. Upgrade test environment
4. Run QA testing
5. Schedule production upgrade during maintenance window

## Rollback Procedure

If issues occur, rollback to the previous version:

1. Stop GlassFish
2. Restore the backed-up ords.war
3. Restore the config directory
4. Start GlassFish
5. Verify functionality

Note: Database schema changes may not be easily reversible. Test thoroughly before production upgrades.

## Conclusion

Upgrading ORDS within the 3.X line is straightforward - copy the new WAR file, run the installer, and redeploy. Always back up first and test in non-production environments before upgrading production systems.

---

Jon Dixon, Co-Founder JMJ Cloud
