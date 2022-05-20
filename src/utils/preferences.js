import EncryptedStorage from 'react-native-encrypted-storage';

export class secureStorage {
    //Obtener datos del storage de la app
    static async getItem(key) {
        try{
            return await EncryptedStorage.getItem(key);
        }catch (e) {
            return JSON.stringify([])
        }
    }

    //Guardar datos en el storage de la app
    static registerItem(key, value){
        try {
            return new Promise(resolve => {
                EncryptedStorage.setItem(
                    key,
                    value
                ).then(resolve)
            })
        }catch (e){console.log(e)}
    }

    //Eliminar datos del storage de la app
    static async removeItem(key){
        try { await EncryptedStorage.removeItem(key) }catch (e) {}
    }
    static async removeAllItems(){
        try { await EncryptedStorage.clear() }catch (e) {}
    }
}