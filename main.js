const Discord=require('discord.js');
const intents=new Discord.Intents();
const client=new Discord.Client();
var filepath="./config.json";
var config=require(filepath);

const fs=require("fs");

client.on('ready',() =>{
    console.log("login with "+client.user.tag+" now");
})


client.on('message',async (msg)=>{
    if(msg.author.bot)return;

    const args = msg.content.split(" ");
    if(args[0]==='!addvc'){
        if(args.length<5){
            const embed=new Discord.MessageEmbed();
            embed.setTitle("Not enough arguments").setColor("RED").setDescription("Not enough arguments");
            msg.channel.send(embed);
            return;
        }
        fs.readFile("config.json",{encoding: "utf-8"},(err,file)=>{
            if(err){
                console.error(err);
            }
            else{
                var configdata=JSON.parse(file);
                configdata.create[configdata.create.length]=[args[1],args[2],args[3],args[4]];
                const configtext=JSON.stringify(configdata,undefined,4);
                fs.writeFile("config.json",configtext,{encoding: 'utf-8'},(err2)=>{
                    if(err){
                        console.error(err2);
                    }
                    else{
                        const embed=new Discord.MessageEmbed();
                        embed.setTitle("Set VC Channel").setColor("GREEN")
                            .setDescription("["+args[1]+","+args[2]+","+args[3]+","+args[4]+"]\nhas been set")
                        msg.channel.send(embed);
                    }
                });
            }
        });
    }
    else if(args[0]==="!vclist"){
        fs.readFile("config.json",{encoding: "utf-8"},(err,file)=>{
            if(err){
                console.error(err);
            }
            else{
                var configdata=JSON.parse(file);
                const embed=new Discord.MessageEmbed();
                embed.setTitle("VC List").setColor("BLUE");
                var list="";
                list=list+"index | チャンネル名 | 新たなvc名\n"
                var index=0;
                for(const val of configdata.create){
                    index++;
                    const valchannel=msg.guild.channels.cache.get(val[0]);
                    if(valchannel==null||valchannel==undefined){
                        notchannel="not find";
                        list=list+String(index).padStart(5)+"　|　"+notchannel.padStart(15)+"　|　"+val[1].padStart(7)+"\n";
                    }
                    else{
                        list=list+String(index).padStart(5)+"　|　"+valchannel.name.padStart(15)+"　|　"+val[1].padStart(7)+"\n";
                    }
                }
                embed.setDescription(list);
                msg.channel.send(embed);
            }
        });
    }
    else if(args[0]==="!deletevc"){
        if(args.length<2){
            const embed=new Discord.MessageEmbed();
            embed.setTitle("Not enough arguments").setColor("RED").setDescription("Not enough arguments");
            msg.channel.send(embed);
            return;
        }
        fs.readFile("config.json",{encoding: "utf-8"},(err,file)=>{
            if(err){
                console.error(err);
            }
            else{
                var configdata=JSON.parse(file);
                configdata.create.splice(Number(args[1])-1,Number(args[1])-1);
                const configtext=JSON.stringify(configdata,undefined,4);
                fs.writeFile("config.json",configtext,{encoding: 'utf-8'},(err2)=>{
                    if(err){
                        console.error(err2);
                    }
                    else{
                        const embed=new Discord.MessageEmbed();
                        embed.setTitle("Delete VC Channel").setColor("YELLOW")
                            .setDescription("index:"+args[1]+"has been delete")
                        msg.channel.send(embed);
                    }
                });
            }
        });

    }
    /*
        !men 人数 チャンネルID
     */
    else if(args[0]==='!men'){
        if(args.length!==3){
            const embed=new Discord.MessageEmbed();
            embed.setTitle("コマンドエラー")
                .setColor("RED")
                .setDescription("引数が足りないもしくは多すぎます");
            msg.channel.send(embed);
            return;
        }
        const targetchannel=msg.guild.channels.cache.get(args[2]);
        if(targetchannel===undefined){
            const embed=new Discord.MessageEmbed();
            embed.setTitle("チャンネルが見つかりません")
                .setColor("RED")
                .setDescription("指定したチャンネルは見つかりませんでした");
            msg.channel.send(embed);
            return;
        }
        const users=targetchannel.members.keyArray();
        var keys=[...Array(users.length).keys()];
        keys=shuffle(keys);
        //var a=[0,1,2,3,4,5,6,7,8,9,10];
        //a=shuffle(a);
        fs.readFile("config.json",{encoding:"utf-8"},(err,file)=>{
            if(err){
                console.error(err);
                const embed=new Discord.MessageEmbed();
                embed.setTitle("ファイルエラー")
                    .setColor("RED")
                    .setDescription("cannot open config file");
                msg.channel.send(embed);
                return;
            }
            const configdata=JSON.parse(file);
            var list="";
            var key=0;
            for(var i=1;i<21;i++){
                if(configdata.teamlist["team"+i].length===0){
                    list+="Team"+i+"\n";
                    for(var j=0;j<args[1];j++){
                        if(keys.length>key){
                            var member=msg.guild.members.cache.get(users[keys[key]]);
                            list+="　　"+member.user.tag+"\n";
                            key++;
                        }
                    }
                }
            }
            if(keys.length>key){
                list+="余り\n";
                for(var i=key;i<keys.length;i++){
                    var member=msg.guild.members.cache.get(users[keys[key]]);
                    list+="　　"+member.user.tag+"\n";
                }
            }
            const embed=new Discord.MessageEmbed();
            embed.setTitle("チーム振り分け完了")
                .setColor("GREEN")
                .setDescription(list);
            msg.channel.send(embed);
            return;
        })
    }
    /*
        !teamlist
     */
    else if(args[0]==='!teamlist'){
        fs.readFile("config.json",{encoding:"utf-8"},(err,file)=>{
            if(err){
                console.error(err);
                const embed=new Discord.MessageEmbed();
                embed.setTitle("ファイルエラー")
                    .setColor("RED")
                    .setDescription("cannot open config file");
                msg.channel.send(embed);
                return;
            }
            const configdata=JSON.parse(file);
            const embed=new Discord.MessageEmbed();
            var list="";
            for(var i=1;i<21;i++){
                list+="Team"+i+"\n";
                for(var j=0;j<configdata.teamlist["team"+i].length;j++){
                    var member=msg.guild.members.cache.get(configdata.teamlist["team"+i][j]);
                    if(member===undefined||member===null){
                        list+="　　Undefined\n";
                    }
                    else{
                        list+="　　"+member.user.tag+"\n";
                    }
                }
            }
            embed.setTitle("固定チームリスト")
                .setColor("GREEN")
                .setDescription(list);
            msg.channel.send(embed);
            return;
        })
    }
    /*
        !team チーム番号
     */
    else if(args[0]==='!team'){
        if(args.length!==2){
            const embed=new Discord.MessageEmbed();
            embed.setTitle("コマンドエラー")
                .setColor("RED")
                .setDescription("引数が足りないもしくは多すぎます");
            msg.channel.send(embed);
            return;
        }
        fs.readFile("config.json",{encoding:"utf-8"},(err,file)=>{
            if(err){
                console.error(err);
                const embed=new Discord.MessageEmbed();
                embed.setTitle("ファイルエラー")
                    .setColor("RED")
                    .setDescription("cannot open config file");
                msg.channel.send(embed);
                return;
            }
            const configdata=JSON.parse(file);
            const teammei="team"+args[1];
            if(configdata.teamlist[teammei].length>2){
                const embed=new Discord.MessageEmbed();
                embed.setTitle("指定したチームへ申請できません")
                    .setColor("BLUE")
                    .setDescription("指定したチームはすでに埋まっています");
                msg.channel.send(embed);
                return;
            }
            for(var i=1;i<21;i++){
                if(configdata.teamlist["team"+i].includes(msg.author.id)){
                    const embed=new Discord.MessageEmbed();
                    embed.setTitle("既にチーム申請を出しています")
                        .setColor("BLUE")
                        .setDescription("既にチーム"+i+"へ参加しています。一度申請を削除してから再度お試しください。");
                    msg.channel.send(embed);
                    return;
                }
            }
            configdata.teamlist[teammei].push(msg.author.id);
            const configtext=JSON.stringify(configdata,undefined,4);
            fs.writeFile("config.json",configtext,{encoding:"utf-8"},(err2)=>{
                if(err){
                    console.error(err2);
                    const embed=new Discord.MessageEmbed();
                    embed.setTitle("ファイルエラー")
                        .setColor("RED")
                        .setDescription("cannot write config file");
                    msg.channel.send(embed);
                    return;
                }
                const embed=new Discord.MessageEmbed();
                embed.setTitle("固定チームの申請を完了")
                    .setColor("GREEN")
                    .setDescription("チーム"+args[1]+"への申請を完了しました");
                msg.channel.send(embed);
                return;
            })
        })
    }
    /*
        !teamdelete チーム番号
     */
    else if(args[0]==="!teamdelete"){
        if(args.length!==2){
            const embed=new Discord.MessageEmbed();
            embed.setTitle("コマンドエラー")
                .setColor("RED")
                .setDescription("引数が足りないもしくは多すぎます");
            msg.channel.send(embed);
            return;
        }
        fs.readFile("config.json",{encoding:"utf-8"},(err,file)=>{
            if(err){
                console.error(err);
                const embed=new Discord.MessageEmbed();
                embed.setTitle("ファイルエラー")
                    .setColor("RED")
                    .setDescription("cannot open config file");
                msg.channel.send(embed);
                return;
            }
            const configdata=JSON.parse(file);
            const teammei="team"+args[1];

            if(configdata.teamlist[teammei].indexOf(msg.author.id)!==-1){
                configdata.teamlist[teammei].splice(configdata.teamlist[teammei].indexOf(msg.author.id),1);
            }
            const configtext=JSON.stringify(configdata,undefined,4);
            fs.writeFile("config.json",configtext,{encoding:"utf-8"},(err2)=>{
                if(err){
                    console.error(err2);
                    const embed=new Discord.MessageEmbed();
                    embed.setTitle("ファイルエラー")
                        .setColor("RED")
                        .setDescription("cannot write config file");
                    msg.channel.send(embed);
                    return;
                }
                const embed=new Discord.MessageEmbed();
                embed.setTitle("固定チームの申請を削除")
                    .setColor("GREEN")
                    .setDescription("チーム"+args[1]+"への申請を削除しました");
                msg.channel.send(embed);
                return;
            })
        })
    }
    /*
        !team_admin チーム番号 ユーザーID
     */
    else if(args[0]==="!team_admin"){
        if(msg.author.id!==config.adminid){
            return;
        }
        if(args.length!==3){
            const embed=new Discord.MessageEmbed();
            embed.setTitle("コマンドエラー")
                .setColor("RED")
                .setDescription("引数が足りないもしくは多すぎます");
            msg.channel.send(embed);
            return;
        }
        fs.readFile("config.json",{encoding:"utf-8"},(err,file)=>{
            if(err){
                console.error(err);
                const embed=new Discord.MessageEmbed();
                embed.setTitle("ファイルエラー")
                    .setColor("RED")
                    .setDescription("cannot open config file");
                msg.channel.send(embed);
                return;
            }
            const configdata=JSON.parse(file);
            const teammei="team"+args[1];
            if(configdata.teamlist[teammei].length>2){
                const embed=new Discord.MessageEmbed();
                embed.setTitle("指定したチームへ申請できません")
                    .setColor("BLUE")
                    .setDescription("指定したチームはすでに埋まっています");
                msg.channel.send(embed);
                return;
            }
            for(var i=1;i<21;i++){
                if(configdata.teamlist["team"+i].includes(args[2])){
                    const embed=new Discord.MessageEmbed();
                    embed.setTitle("既にチーム申請を出しています")
                        .setColor("BLUE")
                        .setDescription("既にチーム"+i+"へ参加しています。一度申請を削除してから再度お試しください。");
                    msg.channel.send(embed);
                    return;
                }
            }
            configdata.teamlist[teammei].push(args[2]);
            const configtext=JSON.stringify(configdata,undefined,4);
            fs.writeFile("config.json",configtext,{encoding:"utf-8"},(err2)=>{
                if(err){
                    console.error(err2);
                    const embed=new Discord.MessageEmbed();
                    embed.setTitle("ファイルエラー")
                        .setColor("RED")
                        .setDescription("cannot write config file");
                    msg.channel.send(embed);
                    return;
                }
                const embed=new Discord.MessageEmbed();
                embed.setTitle("固定チームの申請を完了")
                    .setColor("GREEN")
                    .setDescription("指定したIDの者のチーム"+args[1]+"への申請を完了しました");
                msg.channel.send(embed);
                return;
            })
        })
    }
    /*
        !teamdelete_admin チーム番号 ユーザーID
     */
    else if(args[0]==="!teamdelete_admin"){
        if(msg.author.id!==config.adminid){
            return;
        }
        if(args.length!==3){
            const embed=new Discord.MessageEmbed();
            embed.setTitle("コマンドエラー")
                .setColor("RED")
                .setDescription("引数が足りないもしくは多すぎます");
            msg.channel.send(embed);
            return;
        }
        fs.readFile("config.json",{encoding:"utf-8"},(err,file)=>{
            if(err){
                console.error(err);
                const embed=new Discord.MessageEmbed();
                embed.setTitle("ファイルエラー")
                    .setColor("RED")
                    .setDescription("cannot open config file");
                msg.channel.send(embed);
                return;
            }
            const configdata=JSON.parse(file);
            const teammei="team"+args[1];

            if(configdata.teamlist[teammei].indexOf(args[2])!==-1){
                configdata.teamlist[teammei].splice(configdata.teamlist[teammei].indexOf(args[2]),1);
            }
            const configtext=JSON.stringify(configdata,undefined,4);
            fs.writeFile("config.json",configtext,{encoding:"utf-8"},(err2)=>{
                if(err){
                    console.error(err2);
                    const embed=new Discord.MessageEmbed();
                    embed.setTitle("ファイルエラー")
                        .setColor("RED")
                        .setDescription("cannot write config file");
                    msg.channel.send(embed);
                    return;
                }
                const embed=new Discord.MessageEmbed();
                embed.setTitle("固定チームの申請を削除")
                    .setColor("GREEN")
                    .setDescription("指定した者のチーム"+args[1]+"への申請を削除しました");
                msg.channel.send(embed);
                return;
            })
        })
    }
})

const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

client.on('voiceStateUpdate', (oldState,newState) => onVoiceStateUpdate(oldState,newState));

async function onVoiceStateUpdate(oldState,newState){
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    if(newChannel!=null){
        if(newState.member.user.bot){
            if(newChannel.userLimit===3){
                newChannel.setUserLimit(4);
            }
        }
    }


    if(oldChannel!=null&&oldChannel!=undefined){
        fs.readFile("config.json",{encoding: "utf-8"},(err,file)=>{
            const configdata=JSON.parse(file);
            if(oldChannel!=null){
                for(const val of configdata["create"]){
                    if(val[3]===oldChannel.parentID){
                        if(oldChannel.members.size==0){
                            oldChannel.delete();
                            return;
                        }
                    }
                }
            }
        });
    }
    if(newChannel!=null){
        fs.readFile("config.json",{encoding: "utf-8"},(err,file)=>{
            if(err){
                console.error(err.message);
                return;
            }
            const configdata=JSON.parse(file);
            var newchannelis=false;
            for(const val of configdata["create"]){
                if(val[0]===newChannel.id){
                    var newnamebase=val[1];
                    var vclimit=val[2];
                    var to_vc_id=val[3];
                    newchannelis=true;
                    break;
                }
            }
            if(newchannelis===false){
                return;
            }
            const allchannels=newChannel.guild.channels.cache.filter(c=>c.type==="voice"&&c.parentID===to_vc_id&&!(c.id===newChannel.id));
            let numbers=[];
            allchannels.forEach(function(value,key){
                const number=value.name.replace(newnamebase+"-","");
                if(!(number==="")&&!(isNaN(number))){
                    numbers.push(Number(number));
                }
            });
            numbers.sort(
                function(a,b){
                    return(a<b?-1:1);
                });
            let newnumber;
            let handan=false;
            if(numbers.length===0){
                newnumber=1;
                handan=true;
            }
            else{
                newnumber=0;
                for(const val of numbers){
                    if(val===newnumber+1){
                        newnumber++;
                    }
                    else{
                        newnumber++;
                        handan=true;
                        break;
                    }
                }
            }
            if(handan===false){
                newnumber++;
            }
            let newname=newnamebase+"-"+String(newnumber);
            newChannel.guild.channels
                .create(newname,{type:"voice",parent:to_vc_id,userLimit:Number(vclimit)})
                .then((channel)=>{
                    const mem=newState.member;
                    mem.edit({channel:channel.id});
                })
                .catch(console.error);
        });
    }
}

client.login(config.token);
