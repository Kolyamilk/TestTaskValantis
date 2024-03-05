import md5 from 'md5'
import { useState } from 'react'
import SVGloading from './SVGloading/SvgLoading'


export default function API() {
    const [name, setName] = useState(['Обновить товары'])
    const [list, setList] = useState([])
    const [quantity, setQuantity] = useState(0)


    let date = new Date()
    let year = date.getFullYear()
    let day = date.getDate()
    let mounth = date.getMonth() + 1
    if (mounth < 10) mounth = '0' + mounth
    if (day < 10) day = '0' + date.getDate()
    let xAuth = 'Valantis_' + year + mounth + day
    const URL = 'http://api.valantis.store:40000/'



    //Вывод всех ID 
    async function sendRequest(method, url, id) {
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': md5(xAuth)
            },
            //### Методы.
            body: JSON.stringify({
                "action": "get_ids",
                "params": { "limit": 47 }
            })
        })
            .then(response => {
                return response.json()
            })
    }
    //Получение ID и вывод товара с полями
    async function showProducts(method, url, id) {
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': md5(xAuth)
            },
            body: JSON.stringify({
                "action": "get_items",
                "params": { "ids": id },
            })
        })
            .then(response => {
                return response.json()
            })
    }



    async function handleClick(item) {
        setName('Обновляем...')

        await sendRequest('POST', URL)
            .then(response => getProduct(response.result)
            )
        //получить id и отправить в showproduct
        async function getProduct(product) {
            await showProducts('POST', URL, product)
                .then(response => show(response)
                )
            async function show({ result }) {
                for (let i = 0; i < result.length; i++) {
                    let idProd = [result[i].id]
                    let product = [result[i].product]
                    let price = [result[i].price]
                    item = [...idProd, ...product, ...price];
                    list.push(item)


                    setName('Обновить')
                }
                setList(list)
            }
            setQuantity(list.length)
        }
    }
    function ret(name) {
        if (name === 'Обновляем...') {
       
            return <SVGloading />
        }
    }
    return (
        <>

            <section className="showroom">
                <div className="showroom__nav">
                    <button onClick={handleClick}>{name}</button>

                    <button> Показано: {quantity}</button>
                </div>

                <div className='showroom__list'>
                    <div className='showroom__item'>
                        <ul className='showroom__list'>
                            {
                                list.map((...item) => (
                                    <li key={item[1]} className='showroom__item'>
                                        <div className="number">{item[1]}</div>
                                        <div className="price"> {item[0][2]} руб.<hr /></div>
                                        <div className="name">
                                            {item[0][1]}<hr /></div>
                                        <div className="id"><span> ID</span>  {item[0][0]}</div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

            </section>
            <span className='load'>{ret(name)}</span>
        </>

    )
}