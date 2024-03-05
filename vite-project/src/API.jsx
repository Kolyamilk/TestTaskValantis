import md5 from 'md5'
import { useState } from 'react'

export default function API() {
    const [name, setName] = useState('Загрузка...')
    let date = new Date()
    let year = date.getFullYear()
    let day = date.getDate()
    let mounth = date.getMonth() + 1
    if (mounth < 10) mounth = '0' + mounth
    if (day < 10) day = '0' + date.getDate()
    let xAuth = 'Valantis_' + year + mounth + day
    const URL = 'http://api.valantis.store:40000/'

    async function sendRequest(method, url) {
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': md5(xAuth)
            },
            //### Методы.
            body: JSON.stringify({
                "action": "get_items",
                "params": {
                    "ids": [
                     
                        "1789ecf3-f81c-4f49-ada2-83804dcc74b0"

                    ]
                }
            })
        })
            .then(response => {
                return response.json()
            })
    }
    sendRequest('POST', URL)
        .then(response => getProduct(response.result[0])
        )

    async function getProduct(product) {
        let nameProduct = ' Название: ' + product.product
        let brandProduct = ' Бренд: ' + product.brand
        let priceProduct = ' Цена: ' + product.price
        let idProduct = ' ID: ' + product.id

        let allProduct = nameProduct + priceProduct + idProduct + brandProduct
        setName(allProduct)

    }
    return (
      <p>{name}</p>

        // <button>asdasd</button>,
        // <button>asdasd</button>
    )
}