#bash
set -e
npm run build
if [ -f "developer-tool.tar.gz" ]; then
    # 删除文件
    rm developer-tool.tar.gz
    echo "File $filename was deleted."
else
    echo "File $filename does not exist."
fi
tar -czvf developer-tool.tar.gz dist
ssh tx 'sudo rm -rf /root/website/developer-tool/dist /root/website/developer-tool/developer-tool.tar.gz'
scp ./developer-tool.tar.gz root@tx:/root/website/developer-tool/
ssh tx 'sudo tar -xzvf /root/website/developer-tool/developer-tool.tar.gz -C /root/website/developer-tool/'

if [ -f "developer-tool.tar.gz" ]; then
    # 删除文件
    rm developer-tool.tar.gz
fi