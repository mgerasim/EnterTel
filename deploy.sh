dotnet publish EnterTel.csproj -c Release --runtime linux-x64 --self-contained
tar -czvf bin/EnterTel.tar.gz -C bin/Release/netcoreapp3.1/linux-x64/publish/ .
scp bin/EnterTel.tar.gz dev@dev02:/home/dev/apps/EnterTel/
scp ../EnterTel.service dev@dev02:/home/dev/apps/EnterTel/
scp ../nginx.conf dev@dev02:/home/dev/apps/EnterTel/
ssh dev@dev02 'cd /home/dev/apps/EnterTel && tar -xzvf /home/dev/apps/EnterTel/EnterTel.tar.gz && rm /home/dev/apps/EnterTel/EnterTel.tar.gz && mkdir -p /home/dev/apps/EnterTel/public'
