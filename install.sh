sudo cp /home/dev/apps/EnterTel/EnterTel.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable EnterTel.service
sudo systemctl restart EnterTel.service