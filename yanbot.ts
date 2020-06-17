/**
YanBot is an academic chatbot application to help Dr. Chao-Gan Yan for answering DPABI/DPABISurf/DPARSF questions and managing The R-fMRI Journal Club wechat groups.

YanBot could answer questions including DPABI软件下载、DPARSF软件下载、DPABI软件安装、DPARSF软件安装、DPABISurf软件安装、DPABI编译版软件安装、Demo演示数据、在线网络课程、数据处理报错、常问问题、抑郁症大数据联盟数据下载、加入抑郁症大数据联盟。

YanBot is also a manager for The R-fMRI Journal Club groups, where people are discussing R-fMRI related papers and DPABI/DPABISurf/DPARSF questions. YanBot will invite new friend to The R-fMRI Journal Club groups automatically.

YanBot also bridges The R-fMRI Journal Club 1 and The R-fMRI Journal Club 2 groups, he will also bring the nickname of a user in a specific wechat group to another group. In such a way, users could talk with each other even without in the same wechat group.

If you want to build some chatbot for your own purpose, then YanBot would be a good example!

Dr. Chao-Gan Yan (ycg.yan at gmail)
 */
 
import {
  Contact,
  Message,
  Friendship,
  Wechaty,
}           from 'wechaty'

import { PuppetPadplus } from 'wechaty-puppet-padplus'

import qrTerm from 'qrcode-terminal'

import { ManyToManyRoomConnector, ManyToManyRoomConnectorConfig } from 'wechaty-plugin-contrib'

/**
 *
 * 1. Declare your Bot!
 *
 */

const token = 'puppet_padplus_XXXXXXXX'

const puppet = new PuppetPadplus({
  token,
})

const bot = new Wechaty({
  puppet,
  name : 'typescript',
})

/**
 *
 * 2. Register event handlers for Bot
 *
 */


const config: ManyToManyRoomConnectorConfig = {
  blacklist: [ async () => true ],
  many: [
    '6200300000@chatroom',     // 
    '46600000@chatroom',      // 
  ],
  map: async message => await message.room()?.alias(message.from()??bot.userSelf()) + '(另群): ' + message.text(),
  //map: async message => message.from()?.name() + '(另群): ' + message.text(),
  whitelist: [ async message => message.type() === Message.Type.Text ],
}



bot
.on('login',  onLogin)
.on('scan',   onScan)
.on('error',  onError)
.on('message', onMessage)
.on('friendship',  onFriend)
.use(ManyToManyRoomConnector(config))

/**
 *
 * 3. Start the bot!
 *
 */
bot.start()
.catch(async e => {
  console.error('Bot start() fail:', e)
  await bot.stop()
  process.exit(-1)
})

/**
 *
 * 4. You are all set. ;-]
 *
 */

/**
 *
 * 5. Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan (qrcode: string, status: number) {
  qrTerm.generate(qrcode, { small: true })

  // Generate a QR Code online via
  // http://goqr.me/api/doc/create-qr-code/
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(`[${status}] ${qrcodeImageUrl}\nScan QR Code above to log in: `)
}

function onLogin (user: Contact) {
  console.log(`${user.name()} login`)
  bot.say('Wechaty login').catch(console.error)
}

function onError (e: Error) {
  console.error('Bot error:', e)
}



async function onFriend (request: Friendship) {
  if(request){
        await request.accept()
        const contact = request.contact()
	const name = contact.name()
	await contact.say('您好！我是超的机器人助理。请不要私信问DPABI/DPARSF或其它相关脑影像问题，请在http://rfmri.org上或在微信群里提问。回复JC加入The R-fMRI Journal Club 2讨论群!')
	await contact.say('您还可以问我：DPABI软件下载、DPARSF软件下载、DPABI软件安装、DPARSF软件安装、DPABISurf软件安装、DPABI编译版软件安装、Demo演示数据、在线网络课程、数据处理报错、常问问题、抑郁症大数据联盟数据下载、加入抑郁症大数据联盟等问题！')
        console.log(`${name} send request ${request.hello}`)
    }
}

/**
 *
 * 6. The most important handler is for:
 *    dealing with Messages.
 *
 */
async function onMessage (msg: Message) {

  const contact = msg.from()
  const text = msg.text()
  const room = msg.room()
  if (room) {
    const topic = await room.topic()
    if ((contact !== null) && (contact.name() !== null)){
      console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
    }
  } else {
    if ((contact !== null) && (contact.name() !== null)){
      console.log(`Contact: ${contact.name()} Text: ${text}`)
    }
  }

  if(msg.self()){
    return
  }


  if(/你好/.test(text)){
    msg.say("你好！")
  }
  
  if(/DPABI软件下载/.test(text)){
    msg.say("您好！请访问http://rfmri.org/DPABI下载。")
  }
  
  if(/DPARSF软件下载/.test(text)){
    msg.say("您好！DPARSF是DPABI软件的一个组件，请访问http://rfmri.org/DPABI下载安装DPABI。")
  }
  
  if(/DPABI软件安装/.test(text)){
    msg.say("您好！如果您不需要使用DPABISurf，请先安装MATLAB，再在设置路径（Add folder）里添加spm12路径，最后在设置路径(Add with subfolders）里添加DPABI路径。")
  }
  
  if(/DPARSF软件安装/.test(text)){
    msg.say("您好！如果您不需要使用DPABISurf，请先安装MATLAB，再在设置路径（Add folder）里添加spm12路径，最后在设置路径(Add with subfolders）里添加DPABI路径。")
  }
  
  if(/DPABISurf软件安装/.test(text)){
    msg.say("您好！DPABISurf软件安装比较复杂，请认真学习http:/rfmri.org/Course第五部分。")
  }
  
  if(/DPABI编译版软件安装/.test(text)){
    msg.say("您好！请访问http://rfmri.org/DPABI_Stand-Alone")
  }
  
  if(/Demo演示数据/.test(text)){
    msg.say("您好！请访问http://rfmri.org/DemoData")
  }
  
  if(/在线网络课程/.test(text)){
    msg.say("您好！请访问http://rfmri.org/Course学习我们的免费在线网络课程。建议认真学习3遍以上，并在数据处理中反复回看课程。")
  }
  
  if(/数据处理报错/.test(text)){
    msg.say("您好！请认真阅读http://rfmri.org/DPABIErrorHandling！")
  }
  
  if(/常问问题/.test(text)){
    msg.say("您好！请认真阅读http://rfmri.org/FAQ！")
  }
  
  if(/抑郁症大数据联盟数据下载/.test(text)){
    msg.say("您好！请访问http://rfmri.org/REST-meta-MDD！")
  }
  
  if(/加入抑郁症大数据联盟/.test(text)){
    msg.say("您好！非常感谢您对加入抑郁症大数据联盟感兴趣！非常欢迎您能够一起来共享抑郁症脑影像数据，共建大数据平台，探索抑郁症诊疗生物指标，改善抑郁症诊疗现状！请联系中科院心理所严超赣研究员。")
  }


  if(/JC/.test(text)){
    let keyroom = await bot.Room.find({topic: "The R-fMRI Journal Club 2"})
    if(keyroom){
      if (contact !== null){
        await keyroom.add(contact)
        await keyroom.say('welcome!', contact)
      }
    }
  }


}


