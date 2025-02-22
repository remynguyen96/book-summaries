### Glossary and terms

**Modern**: Takes signals from your ISP via a coax cable connection, and converts them into signals your local device can read - and vice versa.

**Router**: Is a hardware device that serves as the connecting point between a local network and the internet. Routers manage - or route web traffic and data between devices on different networks, and they let multiple devices share the same internet connection.

**Public/External IP Address**: Assigned by your Internet Service Provider (ISP) to your home network. It's how they determine which customer is requesting which website and connect them accordingly. When you enter the address of a website you'd like to visit, your IP address is sent along with that request.

**Private/Internal/Local IP Address**: is defined by your router, which assigns a unique local IP address to each device on your home network, such as your different computers, phones, ... Local IP is more private - because it can't be seen outside of your network.

When you use the internet, the data you send and receive is sent through your public IP address, and then your router passes that traffic onto your device using its private IP address. This process of swapping between public and private IP addresses is called **network address translation (NAT)**.

You can check an IP address against the ranges for public vs private IP addresses to see if a particular IP address is public or private. **All private IP addresses begin with 10, 172, or 192**, though some public IP addresses may also begin with 172 and 192.

### Handy Commands

`ipconfig getifaddr en0`: to find local IP for Wi-Fi connections.

`ipconfig getifaddr en1`: to find local IP for wired connections.

`curl ifconfig.me`: to see your public IP address .
