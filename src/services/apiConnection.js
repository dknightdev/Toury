import axios from "axios";
import { secureStorage } from "../utils/preferences";
import { fetch } from "@react-native-community/netinfo";

const url = 'http://10.0.61.105:3333/'
const timeWait = 1000 * 8 //--> 8 segundo de espera de respuesta del servidor

export const conexionPetitionSesion = async (data, route) => {
    let res = {}
    const isConnect = (await fetch()).isConnected

    if(isConnect) {
        await axios.post(`${url}${route}`, {data}, {timeout: timeWait})
            .then(async (response) => {
                res = await response.data
            })
            .catch(e => {
                console.log(e)
            })
    }else{
        res = {status: 400, message: 'No tienes conexion a internet'}
    }

    return res
}

export const conexionPetitionGeneral = async (data, route) => {
    const token = await secureStorage.getItem('token')
    let res = {}

    const isConnect = (await fetch()).isConnected

    if(isConnect) {
        await axios.post(`${url}${route}`, {data}, {headers: {"authorization": token}, timeout: timeWait})
            .then(async (response) => {
                res = await response.data
            })
            .catch(e => {
                console.log(e)
            })
    }else{
        res = {status: 400, message: 'No tienes conexion a internet'}
    }

    return res
}
