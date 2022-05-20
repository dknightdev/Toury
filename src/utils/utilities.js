//Expresiones regulares de javascript para validar que los textos relacionados cumplan con una condicion

export const patterEmail = /^[a-zA-Z0-9!#$%&'*_+-]([\.]?[a-zA-Z0-9!#$%&'*_+-])+@[a-zA-Z0-9]([^@&%$\/()=?¿!.,:;]|\d)+[a-zA-Z0-9][\.][a-zA-Z]{2,4}([\.][a-zA-Z]{2})?$/
export const patterPassword = /^[a-zA-Z0-9.!#$%&’ *+/=?^_`{|}~-]{8,15}$/
export const patterDocument = /^[0-9]{6,10}$/
export const patterPhone = /^[0-9]{10}$/