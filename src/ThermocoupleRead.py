#!/usr/bin/env python
#
# Bitbang'd SPI interface with a MAX31855 TC->SPI device
#  Connections are:
#     CLK => 18  
#     DOUT => 23 (chip's data out, RPi's MISO)
#     CS => 24 

import RPi.GPIO as GPIO
import time
import sys

MISO = 18
CS = 23
CLK = 24

def setupSpiPins():
    ''' Set pins as an output except MISO (Master Input, Slave Output)'''
    GPIO.setup(CLK, GPIO.OUT)
    GPIO.setup(MISO, GPIO.IN)
    GPIO.setup(CS, GPIO.OUT)
    
    GPIO.output(CLK, GPIO.LOW)
    GPIO.output(CS, GPIO.HIGH)
     

def readTemp():
    
    tcValue = recvBits(32)
    #print "TC value: %x" % (tcValue)

    if (tcValue & 0x8):
      print "ERROR: Reserved bit 3 is 1" 

    if (tcValue & 0x20000):
      print "ERROR: Reserved bit 17 is 1" 

    if (tcValue & 0x10000):
      if (tcValue & 0x1):
        print "ERROR: Open Circuit"
      if (tcValue & 0x2):
        print "ERROR: Short to GND"
      if (tcValue & 0x4):
        print "ERROR: Short to Vcc"

    internal = (tcValue >> 4) & 0xFFF
    #print "Internal: %fC" % (internal*.0625)
    #print "Internal: %fF" % (internal*.0625*9.0/5.0+32)


    tcValue = tcValue >> 18

    temp = tcValue & 0x3FFF
    if (tcValue & 0x2000):
      temp = temp | 0xC000

    temp = temp * 0.25
    return temp
    
def recvBits(numBits):
    '''Receives arbitrary number of bits'''
    retVal = 0

    # Start the read with chip select low
    GPIO.output(CS, GPIO.LOW)
    
    for bit in range(numBits):
        # Pulse clock pin 
        GPIO.output(CLK, GPIO.HIGH)
        
        # Advance input to next bit
        retVal <<= 1

        # Read 1 data bit in
        if GPIO.input(MISO):
            #print 31-bit, "1"
            retVal |= 0x1
        #else:
	#    print 31-bit, "0"
        
        GPIO.output(CLK, GPIO.LOW)
        time.sleep(.001)
    
    # Set chip select high to end the read
    GPIO.output(CS, GPIO.HIGH)

    return (retVal)
    
    
if __name__ == '__main__':
    try:
        GPIO.setmode(GPIO.BCM)
        #print "Started"
        setupSpiPins()
        #print "Setup"
        val = readTemp()
        print str(val)
        #print "Temp: ", str(val*9.0/5.0+32),"F"
        GPIO.cleanup()
        sys.exit(0)
    except KeyboardInterrupt:
        GPIO.cleanup()
        sys.exit(0)
