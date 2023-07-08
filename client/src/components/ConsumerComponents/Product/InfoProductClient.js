import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './styles/info-product.css';

import { Breadcrumbs, Footer, Nav } from '../Common';
import { Toast, handleLoadingPage } from '../../Common';

const InfoProductClient = ({ socket }) => {
    const [users, setUsers] = useState([])
    const [cartUser, setCartUser] = useState([])

    const [products, setProducts] = useState([])
    const [productID, setProductID] = useState('')
    const { name } = useParams()
    const [imagePrimary, setImagePrimary] = useState('')
    const [imageLink, setImageLink] = useState('')
    const [imageList, setImageList] = useState([])
    const [type, setType] = useState('')
    const [option, setOption] = useState([])
    const [optionEdit, setOptionEdit] = useState('')
    const [color, setColor] = useState([])
    const [colorEdit, setColorEdit] = useState([])
    const [price, setPrice] = useState('')
    const [priceEdit, setPriceEdit] = useState('')
    const [percent, setPercent] = useState()
    const [starProduct, setStarProduct] = useState()
    const [voterProduct, setVoterProduct] = useState()

    const [promotes, setPromotes] = useState([])

    const [comments, setComments] = useState([])

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchAPIs = () => {
            fetch("http://localhost:4000/api/users").then(res => res.json()).then(data => {
                setUsers(data.users)
                setLoading(false)
            })

            fetch("http://localhost:4000/api/products").then(res => res.json()).then(data => {
                setProducts(data.products)
                setLoading(false)
            })

            fetch("http://localhost:4000/api/promotes").then(res => res.json()).then(data => {
                setPromotes(data.promotes)
                setLoading(false)
            })

            fetch("http://localhost:4000/api/comments").then(res => res.json()).then(data => {
                setComments(data.comments)
                setLoading(false)
            })
        }
        fetchAPIs()
    }, [])

    useEffect(() => {
        users.map((user, index) => {
            if (user.username === window.localStorage.getItem("userLogged")) {
                setCartUser(user.cart);
            }
        })
        // show thông tin sản phẩm
        products.map((product, index) => {
            if (name === product.name) {
                setProductID(product.id)
                setImagePrimary(product.imagePrimary);
                setImageLink(product.imageLink);
                setImageList(product.imageList);
                setType(product.type);
                setOption(product.option);
                setColor(product.color);
                setPrice(product.price);
                setPercent(product.percent);
                setStarProduct(product.star);
                setVoterProduct(product.voter);
            }
        })

        // show các khuyến mãi dành cho sản phẩm
        var indexPromote = 1;
        promotes.map((promote, index) => {
            const promoteElement = document.querySelectorAll(".info-product__detail-promote-item")[index]
            const promoteIndex = promoteElement.querySelector(".info-product__detail-promote-item-index")

            products.map((product, i) => {
                if (name === product.name) {
                    if ((String(promote.apply).toLowerCase()).includes(String(product.type).toLowerCase())) {
                        promoteIndex.innerHTML = `<span>${indexPromote}</span>`
                        promoteElement.style.display = "flex"
                        indexPromote++;
                    }
                }
            })
        })

        // show thông tin sản phẩm tương tự
        products.map((product, index) => {
            const infoProductSimilar = document.querySelectorAll('.product__sell-item')[index];
            if (product.type === type) {
                infoProductSimilar.style.display = "block";
            }
        })

        // show thông tin đánh giá sản phẩm
        comments.map((comment, index) => {
            const infoVote = document.querySelectorAll('.info-product__review-item')[index];
            if (name === comment.nameProductVoted) {
                infoVote.style.display = "block";
            }
        })

        handleFormatCrumbs()
        handleFeedbackEmpty()
    })

    const handleFormatCrumbs = () => {
        const crumbLinks = document.querySelectorAll(".crumb-link");
        crumbLinks.forEach(crumbLink => {
            if (crumbLink.innerHTML.includes("%")) {
                crumbLink.style.display = "none"
            }
        })
    }

    const handleFeedbackEmpty = () => {
        const feedbackGroup = document.querySelectorAll(".info-product__review-item-feedback")
        feedbackGroup.forEach((feedbackItem, index) => {
            const feedbackContent = feedbackItem.querySelector(".info-product__review-item-feedback-content")
            if (feedbackContent.textContent === "")
                feedbackItem.style.display = "none"
        })
    }

    const handleFormatStarProduct = (starOfProduct) => {
        if (starOfProduct < 1) {
            return `☆☆☆☆☆`
        } else if (starOfProduct < 2) {
            return `★☆☆☆☆`
        } else if (starOfProduct < 3) {
            return `★★☆☆☆`
        } else if (starOfProduct < 4) {
            return `★★★☆☆`
        } else if (starOfProduct < 5) {
            return `★★★★☆`
        } else {
            return `★★★★★`
        }
    }

    const handleSelectOption = (optionData, data) => {
        const optionList = document.querySelector(".info-product__detail-option");
        const optionItems = optionList.querySelectorAll('.info-product__detail-option-item')
        document.querySelector(".info-product__detail-current-price").textContent = `${Number(data).toLocaleString()} đ`
        const colorList = document.querySelectorAll(".info-product__detail-option")[1]
        const colorItemPrices = colorList.querySelectorAll(".info-product__detail-option-item-price")
        colorItemPrices.forEach((colorItemPrice, i) => {
            colorItemPrice.innerHTML = `${Number(data).toLocaleString()} đ`
        })
        optionItems.forEach((optionItem, index) => {
            optionItem.onclick = () => {
                const optionItemActive = optionList.querySelector(".info-product__detail-option-item.info-product__detail-option-item--active")
                if (optionItemActive) {
                    optionItemActive.classList.remove("info-product__detail-option-item--active")
                    optionItem.classList.add('info-product__detail-option-item--active')
                } else {
                    optionItem.classList.add('info-product__detail-option-item--active')
                }
            }
        })
        setOptionEdit(optionData)
        setPriceEdit(data)
    }

    const handleSelectColor = (data) => {
        const colorList = document.querySelectorAll(".info-product__detail-option")[1];
        const colorItems = colorList.querySelectorAll('.info-product__detail-option-item')
        colorItems.forEach((colorItem, index) => {
            colorItem.onclick = () => {
                const colorItemActive = colorList.querySelector(".info-product__detail-option-item.info-product__detail-option-item--active")
                if (colorItemActive) {
                    colorItemActive.classList.remove("info-product__detail-option-item--active")
                    colorItem.classList.add('info-product__detail-option-item--active')
                } else {
                    colorItem.classList.add('info-product__detail-option-item--active')
                }
            }
        })
        setColorEdit(data)
    }

    const changeImage = (fileName) => {
        const imageElement = document.querySelector(".info-product__image-primary")
        imageElement.style.backgroundImage = `url(${fileName})`
        imageElement.style.animation = `toRight 0.2s linear`

        const imgItems = document.querySelectorAll('.info-product__image-item')
        imgItems.forEach((imgItem, index) => {
            imgItem.onclick = () => {
                const imgItemActive = document.querySelector(".info-product__image-item.info-product__image-item--active")
                if (imgItemActive) {
                    imgItemActive.classList.remove("info-product__image-item--active")
                    imgItem.classList.add('info-product__image-item--active')
                } else {
                    imgItem.classList.add('.info-product__image-item--active')
                }
            }
        })
    }

    const arrayImage = []
    products.map((product, index) => {
        if (name === product.name) {
            arrayImage.push(product.imagePrimary, product.imageLink)
            imageList.map((imageItem, i) => {
                arrayImage.push(imageItem)
            })
        }
    })

    let indexImageInArray = 0;
    const handleNextImage = () => {
        if (indexImageInArray >= arrayImage.length - 1) indexImageInArray = -1;
        indexImageInArray++;
        const imageElement = document.querySelector(".info-product__image-primary")
        imageElement.style.backgroundImage = `url(${arrayImage[indexImageInArray]})`

    }
    const handlePrevImage = () => {
        if (indexImageInArray <= 0) indexImageInArray = arrayImage.length;
        indexImageInArray--;
        const imageElement = document.querySelector(".info-product__image-primary")
        imageElement.style.backgroundImage = `url(${arrayImage[indexImageInArray]})`
    }

    const showSuccessMessage = () => {
        Toast({ title: 'Thêm thành công', message: 'Sản phẩm của bạn đã được thêm vào giỏ hàng, Xem ngay nào!', type: 'success', duration: 3000 })
    }
    const showErrorMessage = () => {
        Toast({ title: 'Không thể thêm sản phẩm vào giỏ hàng', message: 'Bạn vui lòng chọn đủ phiên bản và màu sắc của sản phẩm!', type: 'error', duration: 3000 })
    }
    const showErrorNotLoginMessage = () => {
        Toast({ title: 'Bạn chưa đăng nhập vào ShopTECH', message: 'Vui lòng đăng nhập để sử dụng tính năng này!', type: 'error', duration: 4000 })
    }


    const handleClickAddToCart = () => {
        const elementClickActive = document.querySelector(".info-product__detail-option-item.info-product__detail-option-item--active")
        if (elementClickActive) {
            console.log(window.localStorage.getItem("userLogged"))
            if (window.localStorage.getItem("userLogged") === null) {
                showErrorNotLoginMessage()
                return;
            }
            users.map((user, index) => {
                if (window.localStorage.getItem("userLogged") === user.username) {
                    var indexProduct = cartUser.length + 1;
                    socket.emit("addProductToCart",
                        {
                            userID: user.userID,
                            cart:
                            {
                                indexProduct: indexProduct,
                                imageLink: imageLink,
                                id: productID,
                                productName: name,
                                option: optionEdit,
                                color: colorEdit,
                                price: priceEdit,
                                percent: percent,
                                quantity: 1,
                                voted: false
                            }
                        }
                    )
                }
            })
            showSuccessMessage();
            handleLoadingPage(1)
            window.setTimeout(() => {
                window.location.href = window.location.href
            }, 1000)
        }
        else {
            showErrorMessage();
        }
    }

    const handleClickBuyNow = () => {
        const elementClickActive = document.querySelector(".info-product__detail-option-item.info-product__detail-option-item--active")
        if (elementClickActive) {
            if (window.localStorage.getItem("userLogged") === null) {
                showErrorNotLoginMessage()
                return;
            }
            users.map((user, index) => {
                if (window.localStorage.getItem("userLogged") === user.username) {
                    var indexProduct = cartUser.length + 1;
                    socket.emit("addProductToCart",
                        {
                            userID: user.userID,
                            cart:
                            {
                                indexProduct: indexProduct,
                                imageLink: imageLink,
                                id: productID,
                                productName: name,
                                option: optionEdit,
                                color: colorEdit,
                                price: priceEdit,
                                percent: percent,
                                quantity: 1
                            }
                        }
                    )
                }
            })
            showSuccessMessage();
            handleLoadingPage(1)
            window.setTimeout(() => {
                window.location.href = '/cart/info'
            }, 2)
        }
        else {
            showErrorMessage();
        }
    }

    return (
        <>
            <Nav />
            <Breadcrumbs />
            <div id="toast-with-navbar"></div>
            <div className="container">
                <div className="grid wide">
                    <div className="info-product__container">
                        <div className="info-product__header">
                            <label className="info-product__header-name">{name}</label>
                            <p className="info-product__header-star">{handleFormatStarProduct(starProduct)}</p>
                            <p className="info-product__header-voters">({voterProduct} người bình chọn)</p>
                        </div>

                        <div className="info-product__box">
                            <div className="info-product__image-group">
                                <div className="info-product__image-primary"
                                    style={{
                                        backgroundImage: `url(${imagePrimary})`,
                                        backgroundPosition: "center center",
                                        backgroundColor: "transparent",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "contain"
                                    }}>
                                    <div className="info-product__image-pre-btn--prev" onClick={handlePrevImage}>
                                        <i className="fa fa-arrow-left"></i>
                                    </div>
                                    <div className="info-product__image-pre-btn--next" onClick={handleNextImage}>
                                        <i className="fa fa-arrow-right"></i>
                                    </div>
                                </div>
                                <label className="info-product__image-label">Những hình ảnh của sản phẩm</label>
                                <ul className="info-product__image-list">
                                    <li style={{
                                        backgroundImage: `url(${imageLink})`,
                                        backgroundPosition: "center center",
                                        backgroundColor: "transparent",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "contain"
                                    }} className='info-product__image-item info-product__image-item--active'
                                        onClick={(e) => {
                                            changeImage(imageLink)
                                        }}>
                                    </li>

                                    {loading ? <p>Đang kết nối đến server ... </p> : imageList.map((image, i) => (
                                        <li key={i}
                                            style={{
                                                backgroundImage: `url(${image})`,
                                                backgroundPosition: "center center",
                                                backgroundColor: "transparent",
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "cover"
                                            }} className='info-product__image-item'
                                            onClick={(e) => {
                                                changeImage(image)
                                            }}>
                                        </li>
                                    ))}
                                </ul>
                                <div className="info-product__policy">
                                    <label className="info-product__policy-header">CHÍNH SÁCH CỦA SẢN PHẨM</label>
                                    <div className="info-product__policy-item">
                                        <i className="info-product__policy-item-icon fa fa-wrench"></i>
                                        <p className="info-product__policy-item-content">
                                            Bảo hành chính hãng <span style={{ fontWeight: 'bold' }}>12 tháng </span> tại trung tâm bảo hành ủy quyền của hệ thống cửa hàng của ShopTech
                                            <button className="info-product__policy-item-btn">(Xem chi tiết)</button>
                                        </p>
                                    </div>
                                    <div className="info-product__policy-item">
                                        <i className="info-product__policy-item-icon fa fa-refresh"></i>
                                        <p className="info-product__policy-item-content">
                                            <span style={{ fontWeight: 'bold' }}>1 ĐỔI 1 </span>trong vòng 30 ngày đầu sử dụng và <span style={{ fontWeight: 'bold' }}>HỎNG GÌ ĐỔI NẤY </span> trong 90 ngày
                                            <button className="info-product__policy-item-btn">(Xem chi tiết)</button>
                                        </p>
                                    </div>
                                    <div className="info-product__policy-item">
                                        <i className="info-product__policy-item-icon fa fa-retweet"></i>
                                        <p className="info-product__policy-item-content">
                                            Chính sách <span style={{ fontWeight: 'bold' }}>Trade-in lên đời </span> luôn hỗ trợ cho mọi sản phẩm
                                            <button className="info-product__policy-item-btn">(Xem chi tiết)</button>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='info-product__detail'>
                                <label className='info-product__detail-label info-product__detail-label-price'>Giá sản phẩm:</label>
                                <div className='info-product__detail-price'>
                                    <label className='info-product__detail-current-price'>{Number(price).toLocaleString()} đ</label>
                                    <label className='info-product__detail-old-price'>{(Number(price) * (100 + percent) / 100).toLocaleString()} đ</label>
                                    <label className='info-product__detail-percent'>-{percent}%</label>
                                </div>
                                <label className='info-product__detail-installment'>
                                    <i className="info-product__detail-installment-icon fa fa-tag"></i>
                                    Trả góp 0%
                                </label>
                                <div className='info-product__detail-option'>
                                    <label className='info-product__detail-label'>Chọn phiên bản:</label>
                                    {loading ? <p>Đang kết nối đến server ... </p> : option.map((o, i) => (
                                        <div key={i} className='info-product__detail-option-item' onClick={() => {
                                            handleSelectOption(o.data, o.price)
                                        }}>
                                            <div className='info-product__detail-option-item-content'>{o.data}</div>
                                            <div className='info-product__detail-option-item-price'>{Number(o.price).toLocaleString()} đ</div>
                                        </div>
                                    ))}

                                </div>
                                <div className='info-product__detail-option'>
                                    <label className='info-product__detail-label'>Chọn màu sắc:</label>
                                    {loading ? <p>Đang kết nối đến server ... </p> : color.map((c, i) => (
                                        <div key={i} className='info-product__detail-option-item' onClick={() => { handleSelectColor(c) }}>
                                            <div className='info-product__detail-option-item-content'>{c}</div>
                                            <div className='info-product__detail-option-item-price'>{Number(price).toLocaleString()} đ</div>
                                        </div>
                                    ))}
                                </div>
                                <div className='info-product__detail-promote'>
                                    <label className='info-product__detail-promote-label'>
                                        <i className='info-product__detail-promote-label-icon fa fa-gift'></i>
                                        ƯU MÃI RIÊNG CHO SẢN PHẨM
                                    </label>
                                    {loading ? <p>Đang kết nối đến server ... </p> : promotes.map((promote, i) => (
                                        <div className='info-product__detail-promote-item' key={i}>
                                            <p className='info-product__detail-promote-item-index'>{i + 2}</p>
                                            <label className='info-product__detail-promote-item-content'>
                                                {promote.name}
                                                <button className='info-product__detail-promote-item-content-btn'>(Xem chi tiết)</button>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className='info-product__detail-payment'>
                                    <button className='info-product__detail-payment-btn' onClick={handleClickBuyNow}>MUA NGAY
                                        <p className='info-product__detail-payment-describe'>Nhận tại cửa hàng hoặc giao hàng tận nơi</p>
                                    </button>
                                    <button className='info-product__detail-payment-btn-cart' onClick={handleClickAddToCart}>
                                        <i className="info-product__detail-payment-btn-icon fa fa-cart-plus"></i>
                                        Thêm vào giỏ hàng
                                        <p className='info-product__detail-payment-describe'>Thêm sản phẩm để mua sau</p>
                                    </button>
                                    <button className='info-product__detail-payment-btn-installment'>
                                        <i className="info-product__detail-payment-btn-icon fa fa-credit-card"></i>
                                        MUA TRẢ GÓP 0%
                                        <p className='info-product__detail-payment-describe'>Xét duyệt online trong 5 phút</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='info-product__similar'>
                            <div className="info-product__similar-label">SẢN PHẨM TƯƠNG TỰ</div>
                            <ul className="info-product__similar-list">
                                {loading ? <p>Đang kết nối đến server ... </p> : products.map((product, index) => (
                                    <li className="product__sell-item"
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = `/product/${product.enType}/${product.name}`
                                        }}>
                                        <img src={product.imageLink} className='product__sell-item-img'></img>
                                        <label className='product__sell-item-label'>{product.name}</label>
                                        <label className='product__sell-item-price'>{Number(product.price).toLocaleString()} ₫</label>
                                        <span className='product__sell-item-percent'>{(Number(product.price) * 1.065).toLocaleString()}đ</span>
                                        <label className='product__sell-item-sold'>
                                            Đánh giá:
                                            <span className='product__sell-item-star'>{handleFormatStarProduct(product.star)}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='info-product__review-container'>
                            <div className="info-product__rating-box">
                                <label className="info-product__rating-label">ĐÁNH GIÁ SẢN PHẨM</label>
                                <p className="info-product__rating-star">{Number(starProduct).toFixed(1)}/5</p>
                                <p className="info-product__rating-star-icon">{handleFormatStarProduct(starProduct)}</p>
                                <p className="info-product__rating-number">{voterProduct} lượt đánh giá</p>
                            </div>

                            <ul className="info-product__review-list">
                                <label className="info-product__review-label">Nhận xét</label>
                                {loading ? <p>Đang kết nối đến server ... </p> : comments.map((comment, index) => (
                                    <li className="info-product__review-item" key={index}>
                                        <div className="info-product__review-item-title">
                                            <div className='info-product__review-item-info'>
                                                <div className='info-product__review-item-avatar'
                                                    style={{
                                                        backgroundImage: `url(${comment.ownerAvatar})`
                                                    }}>
                                                </div>
                                                <div className='info-product__review-item-fullname'>{comment.ownerName}</div>
                                            </div>
                                            <p className='info-product__review-item-time'>
                                                <i className='info-product__review-item-time-icon fa fa-clock'></i>
                                                {comment.time}
                                            </p>
                                        </div>

                                        <div className='info-product__review-item-vote'>
                                            <label className='info-product__review-item-vote-title'>
                                                Đánh giá sản phẩm:
                                                <span className='info-product__review-item-vote-start'>{handleFormatStarProduct(comment.starVoted)}</span>
                                            </label>
                                        </div>

                                        <div className='info-product__review-item-feedback'>
                                            <label className='info-product__review-item-feedback-title'>Nhận xét sản phẩm:</label>
                                            <div className='info-product__review-item-feedback-box'>
                                                <p className='info-product__review-item-feedback-content'>{comment.content}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer socket={socket} />
            <p className='app-copyright'>©️ Bản quyền thuộc nhóm 7 -  Chuyên đề thực tế 2 - CN20A - năm 2023 <br />
                Địa chỉ: 70 Tô Ký, phường Tân Chánh Hiệp. Quận 12, Thành phố Hồ Chí Minh.</p>
        </>
    )
}

export default InfoProductClient;