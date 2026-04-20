#!/bin/bash
# Download images for SFTP API blog post
# Run this script from the images directory

# Cover image (Green Dragon pub)
curl -L -o cover.jpeg "https://cdn.hashnode.com/res/hashnode/image/upload/v1728918128204/e3043b1a-79fe-4ab1-b2b2-87b3badac216.jpeg"

# Content images
curl -L -o image-01-oci-bucket.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728874992480/207a07b1-873f-4d80-b2fb-913b47e6a7c6.png"
curl -L -o image-02-oci-vault.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728875041518/c53d2b4a-c315-4973-aa0a-0d0462c3942d.png"
curl -L -o image-03-oci-function-app.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728875300160/12300f5f-88ba-42a0-a237-945e9f9a575e.png"
curl -L -o image-04-dynamic-group.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728912689789/5eed8e8e-1af5-4264-9ac3-609956efa998.png"
curl -L -o image-05-policy.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728923793635/c16ecaf1-bce9-4876-b22a-cf79fadd874d.png"
curl -L -o image-06-bucket-inbound.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728912465534/4cb9341a-d071-49de-9fe8-37732b716fee.png"
curl -L -o image-07-api-key.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728912559201/c231b474-139b-44f1-b1e2-d0ec548d3509.png"
curl -L -o image-08-function-ocid.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728924189213/ac7e4295-e0a1-4f1d-8d76-b6b267fbb1f5.png"
curl -L -o image-09-function-test.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728913010521/cf2585cf-c1a5-4273-b731-2e3f222d7274.png"
curl -L -o image-10-bucket-file.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728924503346/5d724fdd-615a-4412-b56e-8782a11cfc21.png"
curl -L -o image-11-bucket-review.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1728940506090/a2cced2a-8d24-4d39-a683-cc4da45c7633.png"
curl -L -o image-12-green-dragon.jpeg "https://cdn.hashnode.com/res/hashnode/image/upload/v1728921935777/2127dd17-a0c7-47b5-954a-c57c8d1dabf8.jpeg"

echo "Download complete!"
ls -la
