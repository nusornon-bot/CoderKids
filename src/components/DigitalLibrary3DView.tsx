import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  Info,
  Code2,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Radio,
  Sliders,
  Play,
  RotateCw,
  BookOpen,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';

export type HardwareModelType = 'microbit' | 'ultrasonic' | 'dht11' | 'servo' | 'soil' | 'pir';

export interface ComponentHotspot {
  id: string;
  name: string;
  position: [number, number, number]; // 3D coordinates on model
  description: string;
  pinout: string;
  codeSnippet: string;
  voltage: string;
  tip: string;
}

export interface HardwareInfo {
  id: HardwareModelType;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  specs: { label: string; value: string }[];
  wiringGuide: { pin: string; target: string; color: string; notes: string }[];
  hotspots: ComponentHotspot[];
  sampleMakeCode: string;
  samplePython: string;
}

export const HARDWARE_CATALOG: Record<HardwareModelType, HardwareInfo> = {
  microbit: {
    id: 'microbit',
    title: 'บอร์ดไมโครคอนโทรลเลอร์ BBC Micro:bit V2',
    subtitle: 'บอร์ดคอมพิวเตอร์ขนาดจิ๋วสำหรับการเรียนรู้วิทยาการคำนวณและ IoT',
    category: 'Main Board / MCU',
    description: 'บอร์ดไมโครคอนโทรลเลอร์มาตรฐานเพื่อการศึกษา ออกแบบโดย BBC ร่วมกับองค์กรชั้นนำ มีจอ LED 5x5, เซนเซอร์ในตัว, ลำโพง, ไมโครโฟน และขอบทองต่อเซนเซอร์ภายนอกได้หลากหลาย',
    specs: [
      { label: 'หน่วยประมวลผล', value: 'Nordic nRF52833 ARM Cortex-M4 64MHz' },
      { label: 'หน่วยความจำ', value: 'Flash 512KB, RAM 128KB' },
      { label: 'การแสดงผล', value: 'จอ LED สีแดง 5×5 (25 ดวง ปรับความสว่างได้)' },
      { label: 'การเชื่อมต่อไร้สาย', value: 'Bluetooth 5.0 & 2.4GHz Micro:bit Radio' },
      { label: 'เซนเซอร์ในตัว', value: 'วัดความเร่ง (Motion), เข็มทิศ (Compass), วัดอุณหภูมิ, ไมโครโฟน' },
      { label: 'แรงดันไฟเลี้ยง', value: '3.0V - 3.3V (ผ่าน Micro USB หรือถ่าน 2xAAA)' },
    ],
    wiringGuide: [
      { pin: 'Pin 0 / P0', target: 'เซนเซอร์สัญญาณแอนะล็อก / สัญญาณเสียง', color: 'bg-yellow-500', notes: 'สัมผัสหรือต่อสายปากคีบจระเข้' },
      { pin: 'Pin 1 / P1', target: 'เซนเซอร์สัญญาณดิจิทัล / สัญญาณปุ่มกด', color: 'bg-yellow-500', notes: 'รองรับ Analog & Digital I/O' },
      { pin: 'Pin 2 / P2', target: 'เซอร์โวมอเตอร์ / เซนเซอร์วัดระยะ', color: 'bg-yellow-500', notes: 'รองรับสัญญาณ PWM' },
      { pin: '3V', target: 'ขั้วบวกเซนเซอร์ (VCC 3.3V)', color: 'bg-rose-500', notes: 'ห้ามจ่ายไฟเกิน 3.3V เข้าบอร์ด' },
      { pin: 'GND', target: 'ขั้วลบกราวด์ (GND 0V)', color: 'bg-slate-700', notes: 'ต้องต่อกราวด์ร่วมกับอุปกรณ์ภายนอกเสมอ' },
    ],
    hotspots: [
      {
        id: 'led_matrix',
        name: 'จอแสดงผล LED 5×5 (25 ดวง)',
        position: [0, 0.15, 0],
        description: 'เมทริกซ์หลอดไฟ LED สีแดง 25 ดวง สามารถเขียนโปรแกรมแสดงไอคอน ตัวเลข ตัวอักษรวิ่ง และทำหน้าที่เป็นเซนเซอร์วัดระดับแสงสว่างรอบข้างได้',
        pinout: 'ขับเคลื่อนผ่านวงจร Multiplexing ภายในชิป',
        codeSnippet: 'basic.showIcon(IconNames.Heart)\nbasic.showString("HELLO")',
        voltage: 'ควบคุมกระแสไฟภายในชิป nRF52833',
        tip: 'สามารถปรับความสว่างได้ตั้งแต่ 0 ถึง 255 ด้วยคำสั่ง led.setBrightness()',
      },
      {
        id: 'button_a',
        name: 'ปุ่มกด A (Button A)',
        position: [-1.4, 0.15, 0],
        description: 'ปุ่มกด Tactile Switch ด้านซ้ายสำหรับรับคำสั่งจากผู้ใช้ ใช้สร้างเกม ควบคุมเมนู หรือเป็นตัวนับสถิติ',
        pinout: 'เชื่อมโยงกับพิน P0.14 ดึงขึ้นภายใน (Pull-up)',
        codeSnippet: 'input.onButtonPressed(Button.A, function () {\n    basic.showNumber(1)\n})',
        voltage: 'ตรรกะแบบ Active LOW (กดแล้วเป็น 0)',
        tip: 'สามารถเขียนตรวจจับการกดปุ่ม A, ปุ่ม B หรือกดปุ่ม A+B พร้อมกันได้',
      },
      {
        id: 'button_b',
        name: 'ปุ่มกด B (Button B)',
        position: [1.4, 0.15, 0],
        description: 'ปุ่มกด Tactile Switch ด้านขวา ใช้คู่กับปุ่ม A เพื่อสร้างปฏิสัมพันธ์ที่หลากหลาย',
        pinout: 'เชื่อมโยงกับพิน P0.23 ดึงขึ้นภายใน (Pull-up)',
        codeSnippet: 'input.onButtonPressed(Button.B, function () {\n    basic.clearScreen()\n})',
        voltage: 'ตรรกะแบบ Active LOW',
        tip: 'เหมาะสำหรับใช้เป็นปุ่มรีเซ็ตหรือปุ่มเพิ่มค่า',
      },
      {
        id: 'edge_connector',
        name: 'ขอบทองเชื่อมต่อ (Edge Connector P0-P2, 3V, GND)',
        position: [0, 0.05, 1.8],
        description: 'แถบทองแดงสำหรับหนีบสายปากคีบ (Alligator Clip) หรือเสียบเข้ากับ Expansion Board เพื่อเชื่อมต่อเซนเซอร์ภายนอก',
        pinout: 'ประกอบด้วยพินขนาดใหญ่ 5 รู: P0, P1, P2, 3V, GND และแถบพินย่อย 20 พิน',
        codeSnippet: 'pins.digitalWritePin(DigitalPin.P0, 1)\nlet val = pins.analogReadPin(AnalogPin.P1)',
        voltage: 'ระดับสัญญาณ 3.3V CMOS Logic',
        tip: 'ระวังอย่าให้สาย 3V ลัดวงจรแตะกับ GND โดยตรงเพราะจะทำให้ชิปป้องกันตัดไฟ',
      },
      {
        id: 'touch_logo',
        name: 'โลโก้สัมผัสสีทอง (Capacitive Touch Logo)',
        position: [0, 0.15, -1.2],
        description: 'สัญลักษณ์ Micro:bit สีทองด้านบนเป็นเซนเซอร์สัมผัสแบบเก็บประจุ (Capacitive Touch) เพียงใช้นิ้วแตะก็สั่งงานโค้ดได้',
        pinout: 'พินตรวจวัดความจุไฟฟ้าบนผิวทองแดง',
        codeSnippet: 'input.onLogoEvent(TouchButtonEvent.Pressed, function () {\n    soundExpression.giggle.play()\n})',
        voltage: 'Capacitive Sensing',
        tip: 'เฉพาะบอร์ด Micro:bit V2 ขึ้นไปเท่านั้นที่มีฟังก์ชันสัมผัสนี้',
      },
    ],
    sampleMakeCode: `input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Heart)
    music.playTone(262, music.beat(BeatFraction.Whole))
})
input.onButtonPressed(Button.B, function () {
    basic.clearScreen()
})`,
    samplePython: `from microbit import *
import music

while True:
    if button_a.is_pressed():
        display.show(Image.HEART)
        music.play(music.BA_DING)
    elif button_b.is_pressed():
        display.clear()
    sleep(100)`,
  },
  ultrasonic: {
    id: 'ultrasonic',
    title: 'เซนเซอร์วัดระยะทางอัลตราโซนิก (HC-SR04)',
    subtitle: 'ตรวจจับสิ่งกีดขวางและวัดระยะทางด้วยคลื่นเสียงความถี่สูง 40kHz',
    category: 'Distance & Obstacle Sensor',
    description: 'โมดูลส่งคลื่นเสียงสะท้อนเพื่อคำนวณระยะห่างวัตถุ มีกระบอกส่ง (Trigger) และกระบอกรับ (Echo) วัดระยะได้แม่นยำตั้งแต่ 2 ซม. ถึง 400 ซม.',
    specs: [
      { label: 'ระยะตรวจจับ', value: '2 ซม. – 400 ซม. (ความแม่นยำ ±3 มม.)' },
      { label: 'มุมตรวจจับ', value: '15 องศาเป็นรูปกรวยเสียง' },
      { label: 'ความถี่คลื่นเสียง', value: '40 kHz (หูมนุษย์ไม่ได้ยิน)' },
      { label: 'แรงดันไฟทำงาน', value: '5V DC (หรือรุ่น 3.3V สำหรับบอร์ดทดลอง)' },
      { label: 'พินเชื่อมต่อ', value: 'VCC, Trig, Echo, GND' },
    ],
    wiringGuide: [
      { pin: 'VCC', target: 'ไฟเลี้ยงบอร์ด 5V หรือ 3.3V (รุ่น RCWL-9610)', color: 'bg-rose-500', notes: 'ตรวจสอบแรงดันไฟของโมดูล' },
      { pin: 'Trig (Trigger)', target: 'พินส่งสัญญาณดิจิทัล เช่น P1', color: 'bg-amber-500', notes: 'ส่งพัลส์ 10us เพื่อเริ่มยิงคลื่น' },
      { pin: 'Echo', target: 'พินรับสัญญาณดิจิทัล เช่น P2', color: 'bg-indigo-500', notes: 'วัดความกว้างพัลส์สะท้อนกลับ' },
      { pin: 'GND', target: 'พิน GND ของบอร์ด Micro:bit', color: 'bg-slate-700', notes: 'กราวด์ร่วม' },
    ],
    hotspots: [
      {
        id: 'transmitter',
        name: 'ลำโพงส่งคลื่นเสียง (Transmitter T)',
        position: [-0.9, 0.4, 0.4],
        description: 'แผ่นเซรามิกเพียโซอิเล็กทริกสั่นสะเทือนเพื่อสร้างคลื่นอัลตราโซนิก 40,000 รอบ/วินาที พุ่งตรงไปข้างหน้า',
        pinout: 'ควบคุมผ่านสัญญาณพิน Trig',
        codeSnippet: 'sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)',
        voltage: 'พัลส์ขับเคลื่อน 40kHz',
        tip: 'คลื่นเสียงจะสะท้อนได้ดีกับวัตถุที่มีพื้นผิวแข็งและเรียบ',
      },
      {
        id: 'receiver',
        name: 'ไมโครโฟนรับคลื่นสะท้อน (Receiver R)',
        position: [0.9, 0.4, 0.4],
        description: 'ทำหน้าที่ดักจับคลื่นเสียงที่สะท้อนกลับมาจากวัตถุ แล้วแปลงเป็นสัญญาณไฟฟ้าส่งออกทางพิน Echo',
        pinout: 'ส่งออกสัญญาณพัลส์ทางพิน Echo',
        codeSnippet: 'let distance = sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)',
        voltage: 'เอาต์พุตพัลส์ดิจิทัล',
        tip: 'ระยะทาง = (เวลาที่คลื่นเดินทาง × ความเร็วเสียง 340 ม./วินาที) ÷ 2',
      },
      {
        id: 'header_pins',
        name: 'พินเชื่อมต่อ 4 ขา (VCC, Trig, Echo, GND)',
        position: [0, -0.6, 0],
        description: 'พินสำหรับเสียบสายจัมเปอร์ตัวเมียเพื่อนำสัญญาณไปต่อเข้ากับ Micro:bit Expansion Shield',
        pinout: 'เรียงจากซ้ายไปขวา: VCC | Trig | Echo | GND',
        codeSnippet: '// คำสั่งวัดระยะทางแบบกำหนดหน่วยเซนติเมตร',
        voltage: 'ระดับสัญญาณดิจิทัล TTL',
        tip: 'หากใช้โมดูล 5V ต้องใช้ตัวแบ่งแรงดัน (Voltage Divider) ลด Echo ลงเหลือ 3.3V เพื่อความปลอดภัยของพิน Micro:bit',
      },
    ],
    sampleMakeCode: `basic.forever(function () {
    let distance = sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)
    basic.showNumber(distance)
    if (distance < 15 && distance > 0) {
        music.playTone(523, music.beat(BeatFraction.Quarter))
    }
    basic.pause(200)
})`,
    samplePython: `from microbit import *
import time

# ส่งพัลส์ 10us ทางพิน P1 และจับเวลาสะท้อนกลับทางพิน P2
def get_distance():
    pin1.write_digital(1)
    time.sleep_us(10)
    pin1.write_digital(0)
    # คำนวณระยะทางจาก microsecond
    pass`,
  },
  dht11: {
    id: 'dht11',
    title: 'เซนเซอร์วัดอุณหภูมิและความชื้นสัมพัทธ์ (DHT11)',
    subtitle: 'อ่านค่าสภาพอากาศและสิ่งแวดล้อมดิจิทัลแบบ 1-Wire Single Bus',
    category: 'Environmental Sensor',
    description: 'เซนเซอร์ยอดนิยมในโครงงาน Smart Farm และห้องเรียนวิทยาศาสตร์ สามารถวัดอุณหภูมิ (0-50°C) และความชื้นสัมพัทธ์ในอากาศ (20-90% RH) พร้อมวงจรปรับเทียบสัญญาณในตัว',
    specs: [
      { label: 'ช่วงวัดอุณหภูมิ', value: '0°C ถึง 50°C (ความคลาดเคลื่อน ±2°C)' },
      { label: 'ช่วงวัดความชื้น', value: '20% ถึง 90% RH (ความคลาดเคลื่อน ±5% RH)' },
      { label: 'ความถี่ในการอ่าน', value: '1 ครั้งต่อวินาที (Sampling rate 1Hz)' },
      { label: 'โปรโตคอลสื่อสาร', value: 'ดิจิทัลสายเดียว (1-Wire Single Bus)' },
      { label: 'แรงดันไฟทำงาน', value: '3.3V – 5.5V DC' },
    ],
    wiringGuide: [
      { pin: 'VCC (+)', target: 'พิน 3V ของ Micro:bit', color: 'bg-rose-500', notes: 'รองรับไฟ 3.3V สมบูรณ์' },
      { pin: 'DATA (Out)', target: 'พินดิจิทัล เช่น P0 หรือ P1', color: 'bg-amber-500', notes: 'ส่งข้อมูล 40 บิต' },
      { pin: 'GND (-)', target: 'พิน GND ของ Micro:bit', color: 'bg-slate-700', notes: 'กราวด์ร่วม' },
    ],
    hotspots: [
      {
        id: 'grill_case',
        name: 'ช่องตะแกรงถ่ายเทอากาศ (Ventilation Grill)',
        position: [0, 0.2, 0.3],
        description: 'กรอบพลาสติกเจาะร่องเพื่อให้อากาศภายนอกไหลผ่านแผ่นเซนเซอร์วัดความชื้นโพลิเมอร์และเทอร์มิสเตอร์ NTC ภายใน',
        pinout: 'ตัวตรวจจับความต้านทานสัมผัสอากาศ',
        codeSnippet: 'dht11_dht22.queryData(DHTtype.DHT11, DigitalPin.P1, true, false, true)',
        voltage: 'ตรวจจับสารดูดซับความชื้น',
        tip: 'ห้ามนำวัตถุแหลมคมจิ้มเข้าไปในช่องตะแกรง เพราะอาจทำลายฟิล์มโพลิเมอร์ได้',
      },
      {
        id: 'pullup_resistor',
        name: 'ตัวต้านทาน Pull-up บนบอร์ดโมดูล',
        position: [0, -0.4, 0.1],
        description: 'ตัวต้านทาน SMD ค่า 4.7kΩ – 10kΩ ช่วยดึงระดับแรงดันของสาย Data ให้เสถียรเพื่อป้องกันสัญญาณรบกวน',
        pinout: 'ดึงขาสัญญาณเข้ากับไฟเลี้ยง VCC',
        codeSnippet: '// ไม่จำเป็นต้องต่อ R ภายนอกเพิ่มเมื่อใช้โมดูล 3 ขา',
        voltage: '3.3V Pull-up',
        tip: 'โมดูล DHT11 ที่มี 3 พินจะมีตัวต้านทานนี้มาให้แล้วในตัว ต่อตรงได้ทันที',
      },
    ],
    sampleMakeCode: `basic.forever(function () {
    dht11_dht22.queryData(DHTtype.DHT11, DigitalPin.P1, true, false, true)
    let temp = dht11_dht22.readData(dataType.temperature)
    let humidity = dht11_dht22.readData(dataType.humidity)
    basic.showString("T:" + temp + "C")
    basic.pause(2000)
})`,
    samplePython: `from microbit import *
# อ่านค่าความชื้นและอุณหภูมิผ่านแพ็กเกจ dht11
# แสดงผลบนหน้าจอ LED 5x5`,
  },
  servo: {
    id: 'servo',
    title: 'เซอร์โวมอเตอร์จิ๋วควบคุมองศา (SG90 Micro Servo 9deg-180deg)',
    subtitle: 'อุปกรณ์กลไกขับเคลื่อนที่ควบคุมตำแหน่งมุมองศาได้อย่างแม่นยำ',
    category: 'Actuator / Motor',
    description: 'มอเตอร์ขนาดกะทัดรัดยอดนิยมสำหรับทำแขนกลหุ่นยนต์ ไม้กั้นทางรถไฟอัตโนมัติ และระบบเปิด-ปิดฝาถังขยะอัจฉริยะ สามารถสั่งให้หมุนไปค้างที่ตำแหน่ง 0° ถึง 180° ผ่านพัลส์ PWM',
    specs: [
      { label: 'แรงบิด (Torque)', value: '1.8 kg/cm (ที่ไฟเลี้ยง 4.8V)' },
      { label: 'ความเร็วการหมุน', value: '0.1 วินาที / 60 องศา' },
      { label: 'มุมควบคุม', value: '0 ถึง 180 องศา' },
      { label: 'สายสัญญาณควบคุม', value: 'พัลส์ PWM 50Hz (ช่วงพัลส์ 0.5ms - 2.5ms)' },
      { label: 'แรงดันไฟทำงาน', value: '4.8V - 6.0V DC (แนะนำใช้ไฟแยกเมื่อโหลดสูง)' },
    ],
    wiringGuide: [
      { pin: 'สายสีส้ม (Signal)', target: 'พินสัญญาณ PWM เช่น P1 หรือ P2', color: 'bg-orange-500', notes: 'ส่งพัลส์สั่งองศา' },
      { pin: 'สายสีแดง (VCC +)', target: 'ไฟบวก 3.3V-5V บนบอร์ดขยาย', color: 'bg-rose-500', notes: 'หากมอเตอร์สั่นให้ใช้ไฟแยก' },
      { pin: 'สายสีน้ำตาล (GND -)', target: 'พิน GND ของ Micro:bit', color: 'bg-amber-900', notes: 'ต้องต่อกราวด์ร่วม' },
    ],
    hotspots: [
      {
        id: 'servo_horn',
        name: 'ใบพัดเซอร์โว (Servo Horn & Shaft)',
        position: [0.6, 0.8, 0],
        description: 'ก้านใบพัดสีขาวสำหรับต่อเข้ากับไม้กั้น แขนกล หรือชิ้นงานประดิษฐ์จากกระดาษลัง/ไม้ไอติมเพื่อสร้างการเคลื่อนไหว',
        pinout: 'ยึดกับแกนเกียร์ด้วยสกรูขนาดเล็ก',
        codeSnippet: 'pins.servoWritePin(AnalogPin.P1, 90) // หมุนไปที่ 90 องศา',
        voltage: 'ขับเคลื่อนด้วยชุดเฟืองไนลอน',
        tip: 'ก่อนขันสกรูใบพัด ให้เขียนโค้ดสั่งเซอร์โวไปที่ 0 องศาก่อน เพื่อตั้งศูนย์กลไก',
      },
      {
        id: 'servo_cable',
        name: 'สายแพ 3 สี (Ribbon Cable)',
        position: [-0.6, 0.1, 0],
        description: 'สายเชื่อมต่อ 3 เส้นมาตรฐาน: สีส้ม (สัญญาณพัลส์), สีแดง (ไฟเลี้ยงบวก), สีน้ำตาล (กราวด์ลบ)',
        pinout: 'Orange: PWM | Red: VCC | Brown: GND',
        codeSnippet: 'pins.servoWritePin(AnalogPin.P2, 180)',
        voltage: 'PWM 50Hz (20ms Period)',
        tip: 'ท่องจำง่ายๆ: "ส้ม-สัญญาณ, แดง-ไฟบวก, ตาล-กราวด์"',
      },
    ],
    sampleMakeCode: `input.onButtonPressed(Button.A, function () {
    // เปิดไม้กั้น 90 องศา
    pins.servoWritePin(AnalogPin.P1, 90)
})
input.onButtonPressed(Button.B, function () {
    // ปิดไม้กั้น 0 องศา
    pins.servoWritePin(AnalogPin.P1, 0)
})`,
    samplePython: `from microbit import *

# สั่ง servo หมุนด้วยคำสั่ง write_analog
# หรือแพ็กเกจ servo ของ Micro:bit
pin1.set_analog_period(20) # 50Hz
# หมุนไปตำแหน่งต่างๆ`,
  },
  soil: {
    id: 'soil',
    title: 'เซนเซอร์วัดความชื้นในดิน (Soil Moisture Sensor Probe)',
    subtitle: 'ตรวจวัดปริมาณน้ำในดินสำหรับระบบรดน้ำต้นไม้อัจฉริยะ',
    category: 'Agriculture & Soil Sensor',
    description: 'โพรบวัดความนำไฟฟ้าในเนื้อดิน เมื่อดินมีความชื้นสูง กระแสไฟจะไหลผ่านได้มาก ค่าแอนะล็อกที่อ่านได้จะเปลี่ยนแปลง นำไปใช้ควบคุมปั๊มน้ำอัตโนมัติในฟาร์มเกษตรอัจฉริยะ',
    specs: [
      { label: 'โหมดเอาต์พุต', value: 'Analog (AO) อ่านค่าละเอียด 0-1023 และ Digital (DO)' },
      { label: 'ขาโพรบตรวจวัด', value: 'ชุบทองป้องกันการเกิดสนิมและออกซิเดชัน' },
      { label: 'การปรับตั้งเกณฑ์', value: 'มี Trimmer หมุนปรับระดับความชื้นตัดต่ออัตโนมัติ' },
      { label: 'แรงดันไฟทำงาน', value: '3.3V – 5.0V DC' },
    ],
    wiringGuide: [
      { pin: 'VCC (+)', target: 'พิน 3V ของ Micro:bit', color: 'bg-rose-500', notes: 'ต่อไฟเลี้ยงบวก' },
      { pin: 'GND (-)', target: 'พิน GND ของ Micro:bit', color: 'bg-slate-700', notes: 'กราวด์ร่วม' },
      { pin: 'A0 (Analog Out)', target: 'พินแอนะล็อก เช่น P0 หรือ P1', color: 'bg-amber-500', notes: 'อ่านค่าความชื้น 0-1023' },
    ],
    hotspots: [
      {
        id: 'gold_prongs',
        name: 'ขาโพรบชุบทองสัมผัสดิน (Sensor Prongs)',
        position: [0, -1.0, 0],
        description: 'แผ่นทองแดงชุบทองสองข้างสำหรับปักลงในดิน เพื่อตรวจวัดความต้านทานไฟฟ้าของน้ำและแร่ธาตุในดิน',
        pinout: 'วงจรแบ่งแรงดันตามความชื้นดิน',
        codeSnippet: 'let moisture = pins.analogReadPin(AnalogPin.P0)',
        voltage: 'กระแสไฟทดสอบต่ำ',
        tip: 'เมื่อไม่ได้ใช้งานควรถอดออกจากดินและเช็ดให้แห้งเพื่อยืดอายุการใช้งาน',
      },
      {
        id: 'comparator_pot',
        name: 'ไอซี LM393 & โพเทนชิโอมิเตอร์ปรับความไว',
        position: [0, 0.7, 0.1],
        description: 'วงจรเปรียบเทียบแรงดันสำหรับส่งสัญญาณ Digital แจ้งเตือนเมื่อดินแห้งเกินระดับที่ตั้งไว้',
        pinout: 'DO (Digital Output) / AO (Analog Output)',
        codeSnippet: 'if (pins.analogReadPin(AnalogPin.P0) < 400) {\n    // ดินแห้ง สั่งเปิดน้ำ\n}',
        voltage: '3.3V Logic',
        tip: 'หมุนตามเข็มนาฬิกาเพื่อเพิ่มความไวในการตัดต่อสัญญาณ',
      },
    ],
    sampleMakeCode: `basic.forever(function () {
    let moisture = pins.analogReadPin(AnalogPin.P0)
    basic.showNumber(moisture)
    if (moisture < 500) {
        // ดินแห้ง: แสดงหน้าเศร้า
        basic.showIcon(IconNames.Sad)
    } else {
        // ดินชุ่มชื้น: แสดงหน้ายิ้ม
        basic.showIcon(IconNames.Happy)
    }
    basic.pause(1000)
})`,
    samplePython: `from microbit import *

while True:
    moisture = pin0.read_analog()
    if moisture < 500:
        display.show(Image.SAD)
    else:
        display.show(Image.HAPPY)
    sleep(1000)`,
  },
  pir: {
    id: 'pir',
    title: 'เซนเซอร์ตรวจจับความเคลื่อนไหว (PIR Motion Sensor HC-SR501)',
    subtitle: 'ตรวจจับคลื่นความร้อนอินฟราเรดจากร่างกายมนุษย์และสัตว์',
    category: 'Security & Motion Sensor',
    description: 'เซนเซอร์ตรวจจับการเคลื่อนไหวแบบ Passive Infrared ตรวจจับการเปลี่ยนแปลงของรังสีความร้อนที่แผ่ออกมาจากสิ่งมีชีวิต นิยมใช้ทำระบบกันขโมย ไฟทางเดินเปิด-ปิดอัตโนมัติ และระบบนับจำนวนคน',
    specs: [
      { label: 'ระยะตรวจจับ', value: '3 ถึง 7 เมตร (ปรับระยะได้ด้วยทริมเมอร์)' },
      { label: 'มุมตรวจจับ', value: '110 องศาเป็นรูปกรวยรอบโดม' },
      { label: 'การหน่วงเวลา (Delay)', value: 'ปรับได้ตั้งแต่ 5 วินาที ถึง 300 วินาที' },
      { label: 'ระดับสัญญาณเอาต์พุต', value: '3.3V High เมื่อตรวจพบ / 0V Low เมื่อปกติ' },
    ],
    wiringGuide: [
      { pin: 'VCC (+)', target: 'พิน 5V หรือ 3.3V', color: 'bg-rose-500', notes: 'จ่ายไฟเลี้ยงวงจร' },
      { pin: 'OUT (Signal)', target: 'พินดิจิทัล เช่น P0 หรือ P1', color: 'bg-amber-500', notes: 'อ่านค่า 1 หรือ 0' },
      { pin: 'GND (-)', target: 'พิน GND ของ Micro:bit', color: 'bg-slate-700', notes: 'กราวด์ร่วม' },
    ],
    hotspots: [
      {
        id: 'fresnel_lens',
        name: 'โดมเลนส์เฟรสเนล (Fresnel Dome Lens)',
        position: [0, 0.4, 0.3],
        description: 'ฝาครอบทรงกลมสีขาวมีเลนส์นูนจิ๋วๆ ช่วยรวมรังสีอินฟราเรดจากหลายทิศทางส่งต่อไปยังเซนเซอร์ตรวจจับด้านใน',
        pinout: 'ครอบเซนเซอร์ Pyroelectric',
        codeSnippet: 'let motion = pins.digitalReadPin(DigitalPin.P0)',
        voltage: 'ดักจับความร้อน 9-10 ไมครอน',
        tip: 'เลนส์สีขาวช่วยกรองแสงสว่างรบกวนในเวลากลางวันไม่ให้กระทบต่อการตรวจจับ',
      },
      {
        id: 'trimmers',
        name: 'ตัวปรับความไวและเวลาหน่วง (Potentiometers)',
        position: [0, -0.6, 0.1],
        description: 'ตัวต้านทานปรับค่าได้สองตัวบนบอร์ด สำหรับหมุนปรับระยะตรวจจับ (Sensitivity) และเวลาที่สัญญาณค้าง (Delay Time)',
        pinout: 'Sx (Distance) | Tx (Delay Time)',
        codeSnippet: '// เอาต์พุตเป็นลอจิก 1 (3.3V) เมื่อมีคนเดินผ่าน',
        voltage: '3.3V High Level',
        tip: 'สำหรับงานแจ้งเตือนแบบเรียลไทม์ ควรหมุนตัวหน่วงเวลา (Tx) ทวนเข็มนาฬิกาจนสุดเพื่อให้รีเซ็ตเร็วที่สุด',
      },
    ],
    sampleMakeCode: `basic.forever(function () {
    let motion = pins.digitalReadPin(DigitalPin.P0)
    if (motion == 1) {
        // ตรวจพบคนเดินผ่าน: เปิดไซเรนแจ้งเตือน
        basic.showIcon(IconNames.Surprised)
        music.playTone(880, music.beat(BeatFraction.Sixteenth))
    } else {
        basic.showIcon(IconNames.Asleep)
    }
    basic.pause(200)
})`,
    samplePython: `from microbit import *
import music

while True:
    if pin0.read_digital() == 1:
        display.show(Image.SURPRISED)
        music.pitch(880, 100)
    else:
        display.show(Image.ASLEEP)
    sleep(200)`,
  },
};

interface DigitalLibrary3DViewProps {
  initialModel?: HardwareModelType;
  onNavigateCodingLab?: () => void;
  onClose?: () => void;
}

export const DigitalLibrary3DView: React.FC<DigitalLibrary3DViewProps> = ({
  initialModel = 'microbit',
  onNavigateCodingLab,
  onClose,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<HardwareModelType>(initialModel);
  const [selectedHotspot, setSelectedHotspot] = useState<ComponentHotspot | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeCodeTab, setActiveCodeTab] = useState<'makecode' | 'python'>('makecode');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [simulatedButtonA, setSimulatedButtonA] = useState<boolean>(false);
  const [simulatedServoAngle, setSimulatedServoAngle] = useState<number>(90);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Scene references kept in ref to prevent React unneeded re-creations
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelGroupRef = useRef<THREE.Group | null>(null);
  const servoArmMeshRef = useRef<THREE.Mesh | null>(null);
  const ledMatrixMeshArrayRef = useRef<THREE.Mesh[]>([]);

  const currentInfo = useMemo(() => HARDWARE_CATALOG[selectedModel], [selectedModel]);

  // Set default hotspot on model change
  useEffect(() => {
    setSelectedHotspot(currentInfo.hotspots[0] || null);
  }, [selectedModel, currentInfo]);

  // -------------------------------------------------------------
  // THREE.JS SCENE SETUP & PROCEDURAL MODELS
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // Slate 900
    scene.fog = new THREE.Fog(0x0f172a, 10, 30);

    // 2. Camera setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 6.5);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Mount canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Room Environment reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback if RoomEnvironment fails
    }

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0); // Warm key
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.0); // Cool fill
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa78bfa, 1.2); // Purple rim
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // 6. Contact Ground Shadow & Grid
    const groundGeo = new THREE.PlaneGeometry(16, 16);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f1d,
      roughness: 0.85,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.8;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(16, 24, 0x334155, 0x1e293b);
    gridHelper.position.y = -1.79;
    scene.add(gridHelper);

    // 7. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 2.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip below ground
    controlsRef.current = controls;

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.5;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // -------------------------------------------------------------
  // BUILD PROCEDURAL 3D HARDWARE MODELS
  // -------------------------------------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove previous model group
    if (currentModelGroupRef.current) {
      scene.remove(currentModelGroupRef.current);
      currentModelGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      currentModelGroupRef.current = null;
    }

    const modelGroup = new THREE.Group();
    currentModelGroupRef.current = modelGroup;
    ledMatrixMeshArrayRef.current = [];
    servoArmMeshRef.current = null;

    // Switch model builder
    switch (selectedModel) {
      case 'microbit':
        buildMicrobitModel(modelGroup, ledMatrixMeshArrayRef.current);
        break;
      case 'ultrasonic':
        buildUltrasonicModel(modelGroup);
        break;
      case 'dht11':
        buildDHT11Model(modelGroup);
        break;
      case 'servo':
        buildServoModel(modelGroup, servoArmMeshRef);
        break;
      case 'soil':
        buildSoilSensorModel(modelGroup);
        break;
      case 'pir':
        buildPIRSensorModel(modelGroup);
        break;
    }

    scene.add(modelGroup);

    // Reset camera position smoothly
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 2.2, 5.5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [selectedModel]);

  // Synchronize Servo Angle in 3D
  useEffect(() => {
    if (selectedModel === 'servo' && servoArmMeshRef.current) {
      // SG90 angle 0-180 mapped to radians
      const rad = ((simulatedServoAngle - 90) * Math.PI) / 180;
      servoArmMeshRef.current.rotation.y = rad;
    }
  }, [selectedModel, simulatedServoAngle]);

  // Synchronize Button A & LED matrix simulation
  useEffect(() => {
    if (selectedModel === 'microbit' && ledMatrixMeshArrayRef.current.length === 25) {
      // If Button A is pressed, turn on heart pattern in 3D
      const heartPattern = [
        0, 1, 0, 1, 0,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        0, 1, 1, 1, 0,
        0, 0, 1, 0, 0,
      ];

      ledMatrixMeshArrayRef.current.forEach((mesh, idx) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const isOn = simulatedButtonA ? heartPattern[idx] === 1 : (idx % 6 === 0 || idx % 4 === 0);
        if (isOn) {
          mat.color.setHex(0xff1e27);
          mat.emissive.setHex(0xff0020);
          mat.emissiveIntensity = 2.5;
        } else {
          mat.color.setHex(0x331010);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
        }
      });
    }
  }, [selectedModel, simulatedButtonA]);

  // Copy code helper
  const handleCopyCode = (text: string) => {
    soundEffects.play('click');
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetCamera = () => {
    soundEffects.play('click');
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 2.2, 5.5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handlePresetView = (view: 'front' | 'top' | 'back' | 'iso') => {
    soundEffects.play('click');
    if (!cameraRef.current || !controlsRef.current) return;
    switch (view) {
      case 'front':
        cameraRef.current.position.set(0, 0.5, 6);
        break;
      case 'top':
        cameraRef.current.position.set(0, 7, 0.01);
        break;
      case 'back':
        cameraRef.current.position.set(0, 0.5, -6);
        break;
      case 'iso':
        cameraRef.current.position.set(4, 3.5, 4.5);
        break;
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  // -------------------------------------------------------------
  // MODEL PROCEDURAL BUILDERS (Composite 3-12 parts)
  // -------------------------------------------------------------

  function buildMicrobitModel(group: THREE.Group, ledArray: THREE.Mesh[]) {
    // 1. PCB Board Base (Black rounded bevel)
    const pcbShape = new THREE.Shape();
    const w = 4.0;
    const h = 3.2;
    const r = 0.35;
    pcbShape.moveTo(-w / 2 + r, -h / 2);
    pcbShape.lineTo(w / 2 - r, -h / 2);
    pcbShape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    pcbShape.lineTo(w / 2, h / 2 - r);
    pcbShape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    pcbShape.lineTo(-w / 2 + r, h / 2);
    pcbShape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    pcbShape.lineTo(-w / 2, -h / 2 + r);
    pcbShape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    const pcbGeo = new THREE.ExtrudeGeometry(pcbShape, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 });
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.45, metalness: 0.1 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.rotation.x = Math.PI / 2;
    pcb.castShadow = true;
    group.add(pcb);

    // 2. Yellow Silk Screen Trim (Top banner)
    const trimGeo = new THREE.BoxGeometry(3.6, 0.02, 0.7);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 }); // Yellow
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, 0.1, -1.1);
    group.add(trim);

    // 3. Gold Touch Logo (Center top)
    const logoGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 32);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
    const logo = new THREE.Mesh(logoGeo, goldMat);
    logo.position.set(0, 0.11, -1.1);
    group.add(logo);

    // 4. 5x5 LED Matrix Display
    const ledContainerGeo = new THREE.BoxGeometry(1.6, 0.04, 1.6);
    const ledContainerMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
    const ledContainer = new THREE.Mesh(ledContainerGeo, ledContainerMat);
    ledContainer.position.set(0, 0.08, 0);
    group.add(ledContainer);

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const ledGeo = new THREE.BoxGeometry(0.18, 0.04, 0.18);
        const ledMat = new THREE.MeshStandardMaterial({
          color: (r * 5 + c) % 4 === 0 ? 0xff1e27 : 0x3b1010,
          emissive: (r * 5 + c) % 4 === 0 ? 0xff0020 : 0x000000,
          emissiveIntensity: (r * 5 + c) % 4 === 0 ? 2 : 0,
          roughness: 0.3,
        });
        const ledMesh = new THREE.Mesh(ledGeo, ledMat);
        ledMesh.position.set((c - 2) * 0.28, 0.11, (r - 2) * 0.28);
        group.add(ledMesh);
        ledArray.push(ledMesh);
      }
    }

    // 5. Tactile Buttons A and B
    const btnHousingMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.5, roughness: 0.4 });
    const btnPlungerMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 });

    // Button A
    const btnAHousing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), btnHousingMat);
    btnAHousing.position.set(-1.4, 0.08, 0);
    const btnAPlunger = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24), btnPlungerMat);
    btnAPlunger.position.set(-1.4, 0.16, 0);
    group.add(btnAHousing, btnAPlunger);

    // Button B
    const btnBHousing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), btnHousingMat);
    btnBHousing.position.set(1.4, 0.08, 0);
    const btnBPlunger = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24), btnPlungerMat);
    btnBPlunger.position.set(1.4, 0.16, 0);
    group.add(btnBHousing, btnBPlunger);

    // 6. Gold Edge Connector Pads (P0, P1, P2, 3V, GND)
    const edgeBaseGeo = new THREE.BoxGeometry(3.9, 0.03, 0.5);
    const edgeBaseMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
    const edgeBase = new THREE.Mesh(edgeBaseGeo, edgeBaseMat);
    edgeBase.position.set(0, 0.08, 1.4);
    group.add(edgeBase);

    // 5 Large gold pads with holes
    const padPositions = [-1.55, -0.85, 0, 0.85, 1.55];
    padPositions.forEach((xPos) => {
      const padGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24);
      const padMesh = new THREE.Mesh(padGeo, goldMat);
      padMesh.position.set(xPos, 0.09, 1.4);

      // Center hole
      const holeGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
      const holeMesh = new THREE.Mesh(holeGeo, holeMat);
      holeMesh.position.set(xPos, 0.1, 1.4);

      group.add(padMesh, holeMesh);
    });

    // Micro gold strips along edge
    for (let i = 0; i < 20; i++) {
      const stripGeo = new THREE.BoxGeometry(0.06, 0.02, 0.25);
      const stripMesh = new THREE.Mesh(stripGeo, goldMat);
      stripMesh.position.set(-1.8 + i * 0.19, 0.09, 1.52);
      group.add(stripMesh);
    }

    // 7. Micro USB Port on top back
    const usbMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.2 });
    const usbGeo = new THREE.BoxGeometry(0.65, 0.22, 0.45);
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(0, 0.12, -1.5);
    group.add(usbMesh);

    // 8. JST Battery Connector on top left
    const jstMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f5, roughness: 0.6 });
    const jstGeo = new THREE.BoxGeometry(0.5, 0.35, 0.4);
    const jstMesh = new THREE.Mesh(jstGeo, jstMat);
    jstMesh.position.set(-1.3, 0.15, -1.45);
    group.add(jstMesh);
  }

  function buildUltrasonicModel(group: THREE.Group) {
    // 1. Blue PCB Base
    const pcbGeo = new THREE.BoxGeometry(3.6, 0.12, 1.6);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.1 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    group.add(pcb);

    // 2. Transmitter Cylinder (Left Metal Barrel with Mesh)
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.25 });
    const meshScreenMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.6 });

    const barrelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.9, 32);

    const barrelLeft = new THREE.Mesh(barrelGeo, barrelMat);
    barrelLeft.rotation.x = Math.PI / 2;
    barrelLeft.position.set(-0.95, 0.45, 0.35);
    barrelLeft.castShadow = true;

    const screenLeft = new THREE.Mesh(new THREE.CircleGeometry(0.48, 24), meshScreenMat);
    screenLeft.position.set(-0.95, 0.45, 0.81);

    group.add(barrelLeft, screenLeft);

    // 3. Receiver Cylinder (Right Metal Barrel)
    const barrelRight = new THREE.Mesh(barrelGeo, barrelMat);
    barrelRight.rotation.x = Math.PI / 2;
    barrelRight.position.set(0.95, 0.45, 0.35);
    barrelRight.castShadow = true;

    const screenRight = new THREE.Mesh(new THREE.CircleGeometry(0.48, 24), meshScreenMat);
    screenRight.position.set(0.95, 0.45, 0.81);

    group.add(barrelRight, screenRight);

    // 4. Crystal Oscillator (Silver oval can in center)
    const crystalGeo = new THREE.BoxGeometry(0.45, 0.18, 0.25);
    const crystalMesh = new THREE.Mesh(crystalGeo, barrelMat);
    crystalMesh.position.set(0, 0.12, 0);
    group.add(crystalMesh);

    // 5. 4-Pin Male Header (VCC, Trig, Echo, GND)
    const pinPlastic = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.18), new THREE.MeshStandardMaterial({ color: 0x18181b }));
    pinPlastic.position.set(0, -0.15, -0.6);
    group.add(pinPlastic);

    const pinGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    for (let i = 0; i < 4; i++) {
      const pinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 12), pinGoldMat);
      pinMesh.position.set(-0.35 + i * 0.23, -0.4, -0.6);
      group.add(pinMesh);
    }
  }

  function buildDHT11Model(group: THREE.Group) {
    // 1. Blue Plastic Slotted Housing
    const housingGeo = new THREE.BoxGeometry(1.6, 2.2, 0.8);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5, metalness: 0.05 });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.set(0, 0.4, 0);
    housing.castShadow = true;
    group.add(housing);

    // 2. Grills / Vent slots
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x0369a1 });
    for (let i = 0; i < 5; i++) {
      const slot = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.04), slotMat);
      slot.position.set(0, 0.8 - i * 0.22, 0.41);
      group.add(slot);
    }

    // 3. Small PCB module base
    const pcbGeo = new THREE.BoxGeometry(1.6, 0.1, 1.0);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.position.set(0, -0.75, 0);
    group.add(pcb);

    // 4. 3-Pin Header
    const pinGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    for (let i = 0; i < 3; i++) {
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.6, 12), pinGoldMat);
      pin.position.set(-0.3 + i * 0.3, -1.1, 0);
      group.add(pin);
    }
  }

  function buildServoModel(group: THREE.Group, hornRef: React.MutableRefObject<THREE.Mesh | null>) {
    // 1. Translucent Blue Housing (SG90 Servo body)
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.88,
      roughness: 0.25,
      metalness: 0.1,
    });
    const bodyGeo = new THREE.BoxGeometry(2.3, 2.2, 1.2);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    group.add(body);

    // 2. Mounting Ear Tabs
    const earGeo = new THREE.BoxGeometry(3.3, 0.14, 1.2);
    const ear = new THREE.Mesh(earGeo, bodyMat);
    ear.position.set(0, 0.4, 0);
    group.add(ear);

    // 3. Top Gear Tower Cylinder
    const towerGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 32);
    const tower = new THREE.Mesh(towerGeo, bodyMat);
    tower.position.set(0.45, 1.35, 0);
    group.add(tower);

    // 4. White Servo Horn (Rotatable arm)
    const hornGroup = new THREE.Group();
    hornGroup.position.set(0.45, 1.62, 0);

    const hornMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 24), hornMat);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.32), hornMat);
    arm.position.set(0, 0, 0);

    // Tiny holes in arm
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 12), holeMat);
      hole.position.set(i * 0.32, 0.01, 0);
      hornGroup.add(hole);
    }

    hornGroup.add(hub, arm);
    group.add(hornGroup);
    hornRef.current = hornGroup as unknown as THREE.Mesh;

    // 5. 3-Color Ribbon Cable
    const brownMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });

    const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 12), brownMat);
    c1.position.set(-1.18, -0.6, -0.15);
    const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 12), redMat);
    c2.position.set(-1.18, -0.6, 0);
    const c3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 12), orangeMat);
    c3.position.set(-1.18, -0.6, 0.15);
    group.add(c1, c2, c3);
  }

  function buildSoilSensorModel(group: THREE.Group) {
    // 1. Long Dual PCB Prongs (Gold plated)
    const prongShape = new THREE.Shape();
    const pW = 0.5;
    const pH = 2.4;
    prongShape.moveTo(-pW / 2, 0);
    prongShape.lineTo(pW / 2, 0);
    prongShape.lineTo(pW / 2, -pH);
    prongShape.lineTo(0, -pH - 0.3); // Triangle tip
    prongShape.lineTo(-pW / 2, -pH);
    prongShape.closePath();

    const prongGeo = new THREE.ExtrudeGeometry(prongShape, { depth: 0.06, bevelEnabled: false });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });

    const prongL = new THREE.Mesh(prongGeo, goldMat);
    prongL.position.set(-0.7, 0, 0);
    const prongR = new THREE.Mesh(prongGeo, goldMat);
    prongR.position.set(0.7, 0, 0);
    group.add(prongL, prongR);

    // 2. Top Header Board
    const topBoard = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 0.12), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 }));
    topBoard.position.set(0, 0.5, 0);
    group.add(topBoard);

    // 3. Potentiometer Trimmer (Blue with white cross screw)
    const pot = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.3), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
    pot.position.set(0, 0.5, 0.2);
    group.add(pot);
  }

  function buildPIRSensorModel(group: THREE.Group) {
    // 1. Green PCB Board
    const pcbGeo = new THREE.BoxGeometry(3.2, 0.12, 2.4);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    group.add(pcb);

    // 2. White Fresnel Hemispherical Lens Dome
    const domeGeo = new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.6,
      metalness: 0.05,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 0.06, 0);
    dome.castShadow = true;
    group.add(dome);

    // 3. Two Orange Potentiometer Trimmers on back edge
    const potMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
    const pot1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), potMat);
    pot1.position.set(-0.9, 0.16, -0.8);
    const pot2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16), potMat);
    pot2.position.set(0.9, 0.16, -0.8);
    group.add(pot1, pot2);
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl text-slate-100 flex flex-col">
      {/* 1. Header Toolbar: Hardware Switcher Tabs */}
      <div className="z-20 p-4 sm:p-5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xl shadow-xs shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>3D Hardware &amp; Sensor Explorer</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">
                  WebGL 3D
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              หมุน ซูม และสำรวจโครงสร้างฮาร์ดแวร์จริง 360 องศาก่อนลงมือต่อวงจรและเขียนโปรแกรม
            </p>
          </div>
        </div>

        {/* Hardware Selector Dropdown / Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          {(Object.keys(HARDWARE_CATALOG) as HardwareModelType[]).map((mKey) => {
            const info = HARDWARE_CATALOG[mKey];
            const isSelected = selectedModel === mKey;
            return (
              <button
                key={mKey}
                onClick={() => {
                  soundEffects.play('click');
                  setSelectedModel(mKey);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{mKey === 'microbit' ? '🤖' : mKey === 'ultrasonic' ? '🦇' : mKey === 'dht11' ? '🌡️' : mKey === 'servo' ? '⚙️' : mKey === 'soil' ? '🌱' : '🚶'}</span>
                <span>{info.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main 3D Viewport with Overlaid Quick Badges */}
      <div className="relative w-full h-[450px] sm:h-[520px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top-Left: Model Title Badge */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-bold text-teal-300 shadow-lg mb-1.5">
            <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
            <span>{currentInfo.category}</span>
          </div>
          <h3 className="text-base sm:text-xl font-black text-white drop-shadow-md">
            {currentInfo.title}
          </h3>
          <p className="text-xs text-slate-300 drop-shadow-sm mt-0.5 line-clamp-2">
            {currentInfo.subtitle}
          </p>
        </div>

        {/* Top-Right: Camera Presets & Rotation Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              autoRotate ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="เปิด/ปิดการหมุน 360 องศาอัตโนมัติ"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">หมุนอัตโนมัติ</span>
          </button>
          <div className="w-px h-4 bg-slate-700" />
          <button
            onClick={() => handlePresetView('front')}
            className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            title="มุมมองด้านหน้า"
          >
            หน้า
          </button>
          <button
            onClick={() => handlePresetView('top')}
            className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            title="มุมมองด้านบน (Top)"
          >
            บน
          </button>
          <button
            onClick={() => handlePresetView('iso')}
            className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            title="มุมมองสามมิติ (Perspective)"
          >
            3D
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
            title="รีเซ็ตตำแหน่งกล้อง"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Model Simulation Buttons (Overlaid bottom left of viewport) */}
        <div className="absolute bottom-4 left-4 z-10">
          {selectedModel === 'microbit' && (
            <div className="flex items-center gap-2 p-2 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-lg">
              <span className="text-[11px] font-bold text-amber-300 ml-1">จำลองกดปุ่ม:</span>
              <button
                type="button"
                onMouseDown={() => {
                  soundEffects.play('click');
                  setSimulatedButtonA(true);
                }}
                onMouseUp={() => setSimulatedButtonA(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
                  simulatedButtonA ? 'bg-rose-600 text-white scale-95' : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-600'
                }`}
              >
                กดปุ่ม A (โชว์ ❤️)
              </button>
            </div>
          )}

          {selectedModel === 'servo' && (
            <div className="flex items-center gap-3 p-2.5 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-lg">
              <span className="text-[11px] font-bold text-amber-300">หมุนองศา:</span>
              <input
                type="range"
                min="0"
                max="180"
                value={simulatedServoAngle}
                onChange={(e) => setSimulatedServoAngle(Number(e.target.value))}
                className="w-28 sm:w-40 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-xs font-black text-indigo-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-700">
                {simulatedServoAngle}°
              </span>
            </div>
          )}
        </div>

        {/* Center Help Hint */}
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none hidden sm:block">
          <span className="text-[10px] text-slate-400 bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-800">
            🖱️ คลิกค้างเพื่อหมุน · ล้อเมาส์เพื่อซูมเข้า/ออก
          </span>
        </div>
      </div>

      {/* 3. Collapsible Ergonomic Bottom Inspection Dock (ตาม Three.js UX Guidelines) */}
      <div className="z-20 bg-slate-900 border-t border-slate-800 transition-all">
        {/* Collapse / Expand Toggle Tab */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950/80 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>สำรวจชิ้นส่วน &amp; คู่มือการต่อวงจร (Inspection &amp; Wiring Guide)</span>
          </div>

          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>{isControlsCollapsed ? '▲ แสดงรายละเอียด' : '▼ ย่อแผงข้อมูล'}</span>
          </button>
        </div>

        {!isControlsCollapsed && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Component Hotspot Selector & Pinout Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>เลือกชิ้นส่วนเพื่อส่องรายละเอียด:</span>
                </span>
                <span className="text-[11px] text-slate-500">คลิกปุ่มด้านล่างเพื่อศึกษา</span>
              </div>

              {/* Hotspot Pills */}
              <div className="flex flex-wrap gap-2">
                {currentInfo.hotspots.map((spot) => {
                  const isAct = selectedHotspot?.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => {
                        soundEffects.play('click');
                        setSelectedHotspot(spot);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isAct
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      <span>🔍</span>
                      <span>{spot.name.split('(')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Hotspot Detail Card */}
              {selectedHotspot && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 shadow-inner space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                        <span>{selectedHotspot.name}</span>
                      </h4>
                      <div className="text-xs text-indigo-300 font-mono mt-0.5">
                        Pinout: {selectedHotspot.pinout}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
                      {selectedHotspot.voltage}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedHotspot.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{selectedHotspot.tip}</span>
                  </div>
                </div>
              )}

              {/* Wiring Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔌</span>
                  <span>ตารางต่อสายสัญญาณ (Wiring Guide):</span>
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5 font-bold">พินอุปกรณ์</th>
                        <th className="p-2.5 font-bold">ต่อเข้ากับ Micro:bit</th>
                        <th className="p-2.5 font-bold">คำแนะนำสำคัญ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {currentInfo.wiringGuide.map((wire, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-2.5 font-mono font-bold text-teal-300">
                            {wire.pin}
                          </td>
                          <td className="p-2.5 font-semibold text-slate-200">
                            {wire.target}
                          </td>
                          <td className="p-2.5 text-slate-400 text-[11px]">
                            {wire.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Col: Code Snippets & Action Buttons */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>ตัวอย่างบล็อกโค้ด &amp; Python:</span>
                </span>

                {/* Tab switch MakeCode / Python */}
                <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setActiveCodeTab('makecode')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      activeCodeTab === 'makecode' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    MakeCode
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('python')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      activeCodeTab === 'python' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>

              {/* Code Box */}
              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>{activeCodeTab === 'makecode' ? 'JavaScript / Blocks' : 'MicroPython (v2)'}</span>
                  <button
                    onClick={() => handleCopyCode(activeCodeTab === 'makecode' ? currentInfo.sampleMakeCode : currentInfo.samplePython)}
                    className="text-teal-400 hover:text-teal-300 font-bold transition-colors cursor-pointer"
                  >
                    {copiedCode ? '✓ คัดลอกแล้ว' : 'คัดลอกโค้ด'}
                  </button>
                </div>
                <pre className="p-3.5 text-xs font-mono text-teal-200 overflow-x-auto leading-relaxed max-h-48">
                  <code>{activeCodeTab === 'makecode' ? currentInfo.sampleMakeCode : currentInfo.samplePython}</code>
                </pre>
              </div>

              {/* Navigation Action to Coding Lab */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.play('click');
                    if (onNavigateCodingLab) {
                      onNavigateCodingLab();
                    }
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-600 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Code2 className="w-4 h-4" />
                  <span>เริ่มลงมือเขียนโค้ดใน Coding Lab ทันที</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Specification Grid */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  ⚡ สเปกและข้อกำหนดทางเทคนิค:
                </span>
                {currentInfo.specs.slice(0, 3).map((spec, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{spec.label}:</span>
                    <span className="font-semibold text-slate-300">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
