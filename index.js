const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const yts = require("yt-search")
const P = require("pino")
async function start(){
const { state, saveCreds } = await useMultiFileAuthState('session')
const sock = makeWASocket({ auth: state, logger: P({ level: "silent" }) })
sock.ev.on('creds.update', saveCreds)
sock.ev.on('messages.upsert', async ({messages})=>{
const m=messages[0]; if(!m.message||m.key.fromMe) return
const from=m.key.remoteJid
const text=m.message.conversation||m.message.extendedTextMessage?.text||""
if(!text.startsWith(".")) return
const args=text.split(/ +/); const cmd=args[0].toLowerCase()
if(cmd==".chit"){return sock.sendMessage(from,{text:"*KING_BOT MENU*\n.chit\n.pprofil\n.img\n.mp3"})}
if(cmd==".pprofil"){
let jid=m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
try{const url=await sock.profilePictureUrl(jid,'image'); await sock.sendMessage(from,{image:{url}})}catch{await sock.sendMessage(from,{text:"Pas de PP"})}
}
if(cmd==".img"){
const q=args.slice(1).join(" "); for(let i=0;i<3;i++) await sock.sendMessage(from,{image:{url:`https://source.unsplash.com/600x400/?${encodeURIComponent(q)}&sig=${i}`}})
}
if(cmd==".mp3"){
const q=args.slice(1).join(" "); const r=await yts(q); const v=r.videos[0]; await sock.sendMessage(from,{text:v.title+"\n"+v.url})
}
})
}
start()