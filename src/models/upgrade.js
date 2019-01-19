import socket from '../services/socket.js';
import pathToRegexp from 'path-to-regexp';
import {message} from 'antd'
export default {
    namespace: 'upgrade',
    state: {
        upgrade:[],
        notUpgrade:[],
        editable:[false,false],
    },
  
    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen(({ pathname }) => {       
                const match = pathToRegexp('/upgrade').exec(pathname)
                if (match) { 
                    socket.emit('upgrade',{type:0})
                    socket.once('upgradeList',(data)=>{
                        console.log('emit(upgrade) once(upgradeList)');
                        console.log(data);
                        let upgrade = [],notUpgrade = []
                        if(data[0].length){
                            data[0].forEach(element => {
                                upgrade.push(element.DevSN)
                            });
                        }
                        if(data[1].length){
                            data[1].forEach(element => {
                                notUpgrade.push(element.DevSN)
                            });
                        }
                        dispatch({type:'save',payload:{upgrade,notUpgrade}})
                    });
                }   
            })
        },
    },
  
    effects: {
      *search({ payload }, { call, put }) {  // eslint-disable-line
        const {DevSN,ifUpgrade} = payload
        socket.emit('upgrade',{type:1,DevSN,ifUpgrade})
        let result = yield new Promise( resolve => {
            socket.once('upgradeResult',(data)=>{
                console.log('emit(upgrade) once(upgradeResult)');
                console.log(data);
                resolve(data)
            })
        }) 
        if(result){
            let alterResult = yield new Promise( resolve => {
                socket.once('upgradeAlterResult',(data)=>{
                    console.log('无emit once(upgradeAlterResult)');
                    console.log(data);
                    resolve(data)
                })
            }) 
            if(alterResult){
                yield put({ type: 'saveDevSN',payload:{DevSN,ifUpgrade}});
            }else{
                message.error('Fail to set the value of upgrade.');
            }
        }else{
            message.error('There is no device:' + DevSN + '.');
        }
      },
        *delete({ payload }, { call, put }) { 
            const {DevSN,ifUpgrade} = payload
            socket.emit('upgrade',{type:2,DevSN,ifUpgrade})
            let result = yield new Promise( resolve => {
                socket.once('upgradeResult',(data)=>{
                    console.log('emit(upgrade) once(upgradeResult)');
                    console.log(data);
                    resolve(data)
                })
            }) 
            if(result){
                yield put({ type:'deleteDevSN',payload:{DevSN,ifUpgrade}});
            }else{
                message.error('Fail to delete.')
            }
        },
        *change({ payload }, { call, put }) { 
            const {DevSN,ifUpgrade} = payload
            socket.emit('upgrade',{type:3,DevSN,ifUpgrade})
            let result = yield new Promise( resolve => {
                socket.once('upgradeResult',(data)=>{
                    console.log('emit(upgrade) once(upgradeResult)');
                    console.log(data);
                    resolve(data)
                })
            }) 
            if(result){
                yield put({ type:'saveDevSN',payload:{DevSN,ifUpgrade:(ifUpgrade?0:1)}});
            }else{
                message.error('Fail to change the value of upgrade.');
            }
        }
    },
  
    reducers: {
        save(state, action) {
          return { ...state, ...action.payload };
        },
        saveDevSN(state,{payload}){
            const {DevSN,ifUpgrade} = payload
            let {upgrade,notUpgrade} = state
            if(ifUpgrade){
                let index = notUpgrade.findIndex(value=>value==DevSN)
                if(index != -1){
                    notUpgrade.splice(index,1)
                    upgrade.push(DevSN)
                }else{
                    let index = upgrade.findIndex(value=>value==DevSN)
                    if(index == -1){
                        upgrade.push(DevSN)
                    }
                }
            }else{
                let index = upgrade.findIndex(value=>value==DevSN)
                if(index != -1){
                    upgrade.splice(index,1)
                    notUpgrade.push(DevSN)
                }else{
                    let index = notUpgrade.findIndex(value=>value==DevSN)
                    if(index == -1){
                        notUpgrade.push(DevSN)
                    }
                }
            }
            return {...state,upgrade,notUpgrade}
        },
        deleteDevSN(state,{payload}){
            const {DevSN,ifUpgrade} = payload
            if(ifUpgrade){
                let {upgrade} = state
                let index = upgrade.findIndex(value=>value==DevSN)
                if(index != -1){
                    upgrade.splice(index,1)
                }
                return {...state,upgrade}
            }else{
                let {notUpgrade} = state
                let index = notUpgrade.findIndex(value=>value==DevSN)
                if(index != -1){
                    notUpgrade.splice(index,1)
                }
                return {...state,notUpgrade}
            }
        }
    },
  
  };
  