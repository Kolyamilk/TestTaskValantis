import md5 from 'md5'
import { useState, useRef } from 'react'
import { useClickOutside } from './useClickOutside'
import SVGloading from './SVGloading/SvgLoading'
import Nav from './Nav'

export default function API() {
    const [name, setName] = useState(['Загрузить товары'])
    const [list, setList] = useState([])
    const [nameProduct, setNameProduct] = useState([])
    const [filterBrendProduct, setFilterBrendProduct] = useState([])
    const [quantity, setQuantity] = useState(0)
    const [thisPage, setThisPage] = useState(1)
    const [open, setOpen] = useState(false)

    const [selectedFilters, setSelectedFilters] = useState([])
    const [filteredItems, setFilteredItems] = useState([])


    const menuRef = useRef(null)
    useClickOutside(menuRef, () => {
        if (open) setTimeout(() => setOpen(false), 50)
    })

    let itemsPerPage = 50
    let currentPage = 1

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
            setName('Загрузка...')
            await sendRequest('POST', URL)
                .then(response => getProduct(response.result)
                )
            //получить id и отправить в showproduct
            async function getProduct(product) {
                await showProducts('POST', URL, product)

                    .then(response => show(response)
                    )

                async function show({ result }) {
                    //Лимитный показ товаров на одной странице
                    function DataTable() {
                        for (let i = 0; i < result.length / itemsPerPage; i++) {
                            let idBrend = [result[i].brand]
                            let idProd = [result[i].id]
                            let product = [result[i].product]
                            let price = [result[i].price]
                            item = [...idProd, ...product, ...price, ...idBrend];
                            list.push(item)
                            filteredItems.push(item)
                            nameProduct.push(item[1])
                            filterBrendProduct.push(item[3])
                        }
                        const indexOfLastPage = currentPage * itemsPerPage;
                        const indexOfFirstPage = indexOfLastPage - itemsPerPage;
                        let currentItems = result.slice(indexOfFirstPage, indexOfLastPage)

                        let newCurrentItems = currentItems.slice()
                        console.log('currentItems: ' + newCurrentItems);
                        document.getElementById('h1').innerHTML = `
                       <h1> Товаров:  <span>(${indexOfFirstPage} - ${indexOfLastPage})</span></h1>
                        `
                        //Вывод карточек товара на страницу
                        document.getElementById('showroom__list').innerHTML = currentItems.map(item =>
                            `
                            <li className='showroom__item'>         
                                    <div className="price"><strong> Цена: </strong> ${item.price} руб.<hr /></div>
                                    <div className="name" ><strong> Имя: </strong>${item.product}<hr /></div>
                                    <div className="brend"><strong> Бренд: </strong>${item.brand}<hr /></div>
                                    <div className="id"><strong> ID: </strong>${item.id}</div>
                            </li>
                            `
                        )
                        setFilteredItems(filteredItems)
                        setList(list)
                        setName('Загружено ')
                    }
                    DataTable()
                    //Создаём новый массив и удаляем null значения в нём
                    var filteredBrend = filterBrendProduct.filter(function (el) {
                        return el != null;
                    })

                    //Вывод в меню фильтр  всех Брендов
                    const brends = filteredBrend.map((item, key) => {
                        return (
                            <li key={key}>
                                <input type="checkbox" name={item} id={item} />
                                <label htmlFor={item}>{item}</label>
                            </li>
                        );
                    });
                    setFilterBrendProduct(brends)
                    function nextPage() {
                        currentPage++
                        DataTable()
                    }
                    function prevPage() {
                        currentPage--
                        DataTable()
                    }
                    document.getElementById('nextBtn').addEventListener('click', nextPage, false)
                    document.getElementById('prevBtn').addEventListener('click', prevPage, false)
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

            return
        }

    }
    //Добавляет картинку загрузки
    function ret(name) {
        if (name === 'Загрузка...') {
            return <SVGloading />
        }
    }
    function setNextPage() {
        setThisPage(thisPage + 1)
    }
    function setPrevPage() {
        if (thisPage === 1) {
            return
        } else {
            setThisPage(thisPage - 1)
        }
    }
    return (
        <>

            <section className="showroom">

                <div className="showroom__nav">
                    <button onClick={handleClick}>{name}</button>

                    <div className='paginationNav'>
                        <button className='button' id='prevBtn' onClick={setPrevPage}>&#8592;</button>
                        <div className="paginationNav__list">
                            <span>{thisPage == 1 ? null : thisPage - 1}</span>
                            <span className='currentPage'>{thisPage}</span>
                            <span>{thisPage + 1}</span>
                        </div>
                        <button className='button' id='nextBtn' onClick={setNextPage}>&#8594;</button>
                    </div >
                    <button className='menu__button' onClick={() => setOpen(!open)}> Фильтр</button>
                    <nav className={`menu ${open ? 'active' : ""} `} ref={menuRef}>
                        <button className='btn'>Бренд</button>
                        <ul className='menu__filter'>
                            {filterBrendProduct}
                        </ul>
                        {/* <button className='btn'>Цена</button>
                        <button className='btn'>Имя</button> */}

                    </nav>

                </div>
                <div className='showroom__list'>
                    <div className='showroom__item'>

                        <div className="">
                            <ul className='showroom__list' id='showroom__list'>

                            </ul>
                        </div>
                    </div>
                </div>
            </section >

            <span className='load'>{ret(name)}</span>




        </>
    )
}