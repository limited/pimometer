pimometer
=========
=======
## Remote Thermocouple Monitor


### Goal 
PCB to report temperature from 4 k-type thermocouples over wireless, for viewing on a smartphone. 
* _Form Factor_: Raspberry Pi Shield
* _Power Source_: Initially battery powered with on/off switch. 
** Future: solar or thermoelectric generator(TEG) using heat from oven.
* _Thermocouple Measurement_: MAX31855 [Datasheet](http://datasheets.maximintegrated.com/en/ds/MAX31855.pdf) via SPI in an SO-8 package
* _Wireless Connection_: WiFi Dongle
* _Configuration/Display_: via SD Card 
** LEDs for display- 1 LED for wireless connection
* Smartphone Display: Ideally would be accessible across multiple smartphone platforms, so no native app. 
** Better to have a webserver run on the device itself, i.e. Flask

### Design
#### Raspberry Pi pinout
* Clock: 11 
* MISO: 9
* CS1: 18 
* CS2: 23
* CS3: 24
* CS4: 25
* Also need +3.3V and ground available to shield
 
#### Software Design
* When Flask receives request for current temperatures, 
o


#### Service installation
chmod 755 nodejs
sudo cp nodejs /etc/init.d
sudo update-rc.d nodejs defaults

### Avahi Installation
sudo apt-get install avahi-daemon
sudo insserv avahi-daemon



#### Cost Comparison
Component  |  Raspberry Pi  | Arduino (TC shield + wifi breakout)
-----------+----------------+-------------------------------------
Controller |   $35          |    $7
Crystal    |                |    $1
Regulator  |                |    $2
Wifi       |   $15          |    $35
SD card    |   $8           |    
------------------------------------------------------------------
Subtotal   |   $58          |    $45

TC shield
------------
4xTC       |              $32
Custom PCB |              $15?
 

Enclosure    |
LiPo Battery | 
LiPo Charger |
