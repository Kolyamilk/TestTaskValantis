import md5 from 'md5'
import { useState } from 'react'
import SVGloading from './SVGloading/SvgLoading'



export default function API() {
    const [name, setName] = useState(['Загрузить товары'])
    const [list, setList] = useState([])
    const [quantity, setQuantity] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4

    let date = new Date()
    let year = date.getFullYear()
    let day = date.getDate()
    let mounth = date.getMonth() + 1
    if (mounth < 10) mounth = '0' + mounth
    if (day < 10) day = '0' + date.getDate()
    let xAuth = 'Valantis_' + year + mounth + day
    const URL = 'http://api.valantis.store:40000/'
    //(1) Вывод всех ID 
    async function sendRequest(method, url) {
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': md5(xAuth)
            },
            //### Методы.
            body: JSON.stringify({
                "action": "get_ids",
                "params": { "offset": 0 }
            })
        })
            .then(response => {
                return response.json()
            })
    }
    //(2)Получение ID и вывод товара с полями
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
    //3() Вывод товаров 

    async function handleClick(item) {

        if (quantity < 50) {
            setName('Обновляем...')
            await sendRequest('POST', URL)
                .then(response => getProduct(response.result)
                )
            //получить id и отправить в showproduct
            async function getProduct(product) {
                await showProducts('POST', URL, product)

                    .then(response => show(response)
                    )


                // Пагинация


                async function show({ result }) {


                    function DataTable() {
                        console.log(result);





                        for (let i = 0; i < result.length / itemsPerPage; i++) {
                            let idProd = [result[i].id]
                            let product = [result[i].product]
                            let price = [result[i].price]
                            item = [...idProd, ...product, ...price];
                            list.push(item)
                        }
                        const indexOfLastPage = currentPage * itemsPerPage;
                        console.log(indexOfLastPage);
                        const indexOfFirstPage = indexOfLastPage - itemsPerPage;
                        console.log('индекс ферст пейдж' + indexOfFirstPage);
                        const currentItems = result.slice(indexOfFirstPage, indexOfLastPage)
                   


                        document.getElementById('showroom__list').innerHTML = currentItems.map(item =>
                            `
                            <li key=${item[1]} className='showroom__item'>
                                    <div className="price"> ${item.price} руб.<hr /></div>
                                    <div className="name">${item.product}<hr /></div>
                                    <div className="id"><span> ID</span>${item.id}</div>
                            </li>
                            `
                        )

                        setList(list)
                        setName('Обновить')
                    }
                    DataTable()
                    const nextPage = () => {
                       
                        setCurrentPage(currentPage + 1)
                        DataTable()
                    }

                    document.getElementById('nextBtn').addEventListener('click', nextPage)
                    // for (let i = 0; i < result.length; i++) {

                    //     let idProd = [result[i].id]
                    //     let product = [result[i].product]
                    //     let price = [result[i].price]
                    //     item = [...idProd, ...product, ...price];

                    //     // list.push(item)
                    // }

                }
                setQuantity(itemsPerPage)
            }
        } else {
            setName('Максимум 50 товаров')
            return
        }

    }

    //Добавляет картинку загрузки
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
                    <div className='paginationNav'>
                        <button className='button'>Предыдущая</button>
                        <div className="paginationNav__list">
                            <span>{currentPage == 1 ? null : currentPage - 1}</span>
                            <span className='currentPage'>{currentPage}</span>
                            <span>{currentPage + 1}</span>
                        </div>
                        <button className='button' id='nextBtn'>Следующая</button>
                    </div >
                    <button> Показано: {quantity}</button>
                </div>
                <div className='showroom__list'>
                    <div className='showroom__item'>

                        <ul className='showroom__list' id='showroom__list'>

                            {




                                // list.map((...item) => (
                                //     <li key={item[1]} className='showroom__item'>
                                //         <div className="number">{item[1]}</div>
                                //         <div className="price"> {item[0][2]} руб.<hr /></div>
                                //         <div className="name">
                                //             {item[0][1]}<hr /></div>
                                //         <div className="id"><span> ID</span>  {item[0][0]}</div>
                                //     </li>
                                // ))
                            }
                        </ul>
                    </div>
                </div>
            </section>
            <span className='load'>{ret(name)}</span>
        </>
    )
}