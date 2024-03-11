var btnHomeMenu = null, userData = null, arrayProducts = [], btnShowShoppingCard = null, textLogo, 
wrapperHomeShoppItems, totalTable, lastIds = "", inputsAccount, wrapperProducts, productDetailWrapper, currentProductFilter = "all";
var detailImgProduct, detailPriceProduct, detailTittleProduct, detailDescripProduct, detailBtn, detailBtnText, searchInputElement,
previousId = "", homeSearchInput, searchCleanIcon, getTotalLoadedProducts = 0, userText, passText, errorMessage,
labelsLogin, btnLogin, firstChange = false, menuNav, itemAllMobile, itemAllDesk, leftNav, headerHomeNav, counter;

userData = Login[0];
arrayProducts = Products;


window.addEventListener("load", function() {
    if(window.location.href == "http://127.0.0.1:5500/index.html") {
        userText = document.getElementById("js-user-txt");
        passText = document.getElementById("js-password-txt");
        errorMessage = document.getElementById("js-error-message");
        labelsLogin = document.getElementsByTagName("label");
        btnLogin = this.document.getElementById("login-btn");
    
        btnLogin.addEventListener("click", validateLogin);
        userText.addEventListener("input", changeUserLogin);
        passText.addEventListener("input", changeUserLogin);
        passText.addEventListener("keyup", checkLoginText);
    }

    if(window.location.href == "http://127.0.0.1:5500/views/home.html") {
        const homeSearch = this.document.querySelector(".search-home-section");
        btnHomeMenu = this.document.getElementById("js-menu-tab");
        btnShowShoppingCard = this.document.getElementById("js-shopping-card-tab");
        textLogo = this.document.getElementById("js-tittle-logo");
        wrapperHomeShoppItems =  this.document.getElementById("js-shopping-container-items");
        totalTable = this.document.getElementById("js-shopping-total");
        wrapperProducts = document.getElementById("js-products-container");
        productDetailWrapper = document.getElementById("js-product-detail");
        detailBtn = document.getElementById("js-detail-btn");
        detailBtnText = document.getElementById("js-detail-btn-text");
        itemAllMobile = document.getElementById("js-all-mobile");
        itemAllDesk = document.getElementById("js-all-desk");
        homeSearchInput = document.getElementById("search-input");
        searchCleanIcon = document.getElementById("js-clean-search");
        menuNav = document.getElementById("js-menu-nav");
        leftNav = document.getElementById("js-left-nav");
        headerHomeNav = document.querySelector(".header-home-nav");
        counter = document.getElementById("js-counter-circle");
        searchInputElement = document.querySelector(".search-home-section");

        detailImgProduct = document.getElementById("js-detail-img");
        detailPriceProduct = document.getElementById("js-detail-price");
        detailTittleProduct = document.getElementById("js-detail-tittle");
        detailDescripProduct = document.getElementById("js-detail-descrip");
        loadProducts();
        calcShoppingTabRightMargin();
        
        let lastScrollY = window.scrollY;
        window.addEventListener("scroll", () => {
            if(lastScrollY < window.scrollY) {
                homeSearch.classList.add("search--hidden");
            } else {
                homeSearch.classList.remove("search--hidden");
            }

            lastScrollY = window.scrollY;
        });
    }

    if(window.location.href == "http://127.0.0.1:5500/views/my-account.html") {
        inputsAccount = document.getElementsByClassName("general-input");
    }
});

window.addEventListener("resize", () => {
    if(window.location.href == "http://127.0.0.1:5500/views/home.html") {
        if(this.innerWidth >= 500) {
            if(textLogo.classList[0] != "hide-logo") {
                textLogo.classList.add("hide-logo");
                leftNav.classList.remove("hide-logo");
            }
        }
        calcShoppingTabRightMargin();
    }
});

function calcShoppingTabRightMargin() {
    if(this.innerWidth < 500) {
        btnShowShoppingCard.style.right = 0;
        productDetailWrapper.style.right = 0;
        searchInputElement.style.left = "5%";
    } else if(this.innerWidth < 1187) {
        btnShowShoppingCard.style.right = "5px";
        productDetailWrapper.style.right = "5px";
        searchInputElement.style.left = "5%";
    } else {
        const shoppingTabMarginRight = (window.innerWidth - headerHomeNav.offsetWidth) / 2;
        btnShowShoppingCard.style.right = shoppingTabMarginRight + "px";
        productDetailWrapper.style.right = shoppingTabMarginRight + "px";
        searchInputElement.style.left = shoppingTabMarginRight + 15 + "px";
    }
}

function showMyAccount() {
    window.location.href = "../views/create-account.html";
}

function showLogin() {
    window.location.href = "../index.html";
}



function addToCardBtn(idMyElement) {
    if(document.getElementById(idMyElement) === null) {
        let filteredProducts = userData.currentSelectedProducts.filter((item) => item.idProduct != idMyElement);
        userData.currentSelectedProducts = filteredProducts;
        counter.textContent = userData.currentSelectedProducts.length;
    } else {
        const myElement = document.getElementById(idMyElement);
        const father = myElement.parentElement;
        
        if(father.classList[1] == "clickedBtn") {
            father.classList.remove("clickedBtn");
            myElement.setAttribute('src', "../assets/icons/add_to_cart.svg");
            let filteredProducts = userData.currentSelectedProducts.filter((item) => item.idProduct != idMyElement);
            userData.currentSelectedProducts = filteredProducts;
            counter.textContent = userData.currentSelectedProducts.length;
        } else {
            father.classList.add("clickedBtn");
            myElement.setAttribute('src', "../assets/icons/selected-to-buy.svg");
            userData.currentSelectedProducts.push({ idProduct: idMyElement });
            counter.textContent = userData.currentSelectedProducts.length;
        }
    }
}

function showMenu() {
    btnHomeMenu.classList.add("menu-active");
    document.body.classList.add("no-scroll");
}

function hideMenu() {
    btnHomeMenu.classList.remove("menu-active");
    document.body.classList.remove("no-scroll");
}

function handleHomeList(myElement) {
    const fater = myElement.parentElement;
    if(!myElement.classList[1]) { 
        const oldSelectedItemMobile = document.querySelector(".selected-item-mobile");
        const oldSelectedItemDesk = document.querySelector(".selected-item-desk");
        oldSelectedItemDesk.classList.remove("selected-item-desk");
        oldSelectedItemMobile.classList.remove("selected-item-mobile");
        if(fater.id == "home-nav-mobile") {
            myElement.classList.add("selected-item-mobile");
            const mobileItem = document.getElementById("js-" + myElement.innerHTML.toLowerCase() + "-desk");
            mobileItem.classList.add("selected-item-desk");
        } else if(fater.id == "home-nav-desk") {
            myElement.classList.add("selected-item-desk");
            const deskItem = document.getElementById("js-" + myElement.innerHTML.toLowerCase() + "-mobile");
            deskItem.classList.add("selected-item-mobile");
        }

        currentProductFilter = myElement.innerHTML.toLowerCase();
        homeSearchInput.value = "";
        searchCleanIcon.classList.remove("close-vissible");
        loadProducts(myElement.innerHTML.toLowerCase());
        
    } else if(myElement.innerHTML == "All" && arrayProducts.length != getTotalLoadedProducts) {
        console.log("All item is been reoladed!!");
        loadProducts(); 
    }
}

function removeShoppingTabStyle() {
    btnShowShoppingCard.classList.remove("menu-active");
    document.body.classList.remove("no-scroll");
    textLogo.classList.add("hide-logo");
    leftNav.classList.remove("hide-logo");
}


function showShoppingCard() {
    if(window.innerWidth < 500) { 
        btnShowShoppingCard.classList.remove("show-section");
        if(btnShowShoppingCard.classList[1] == "menu-active") {
            removeShoppingTabStyle();
        } else {
            btnShowShoppingCard.classList.add("menu-active");
            document.body.classList.add("no-scroll");
            leftNav.classList.add("hide-logo");
            textLogo.classList.remove("hide-logo");
            showProductsSelected();
        }
    } else { 
        if(btnShowShoppingCard.classList[1] == "show-section") {
            btnShowShoppingCard.classList.remove("show-section");
        } else if(btnShowShoppingCard.classList[1] == "menu-active") {
            removeShoppingTabStyle();
            calcShoppingTabRightMargin();
        } else {
            btnShowShoppingCard.classList.add("show-section");
            calcShoppingTabRightMargin();
            showProductsSelected();
        }
    }
}

function loadProducts(filter = "all", searchInput = "") {
    let infoProduct = null, concatArticles = "";
    let newFilterOfProducts = filterHomeProducts(filter, searchInput);
    getTotalLoadedProducts = newFilterOfProducts.length;

    for(let productItem in newFilterOfProducts) {
        infoProduct = newFilterOfProducts[productItem];

        let isSelected = userData.currentSelectedProducts.filter(item => item.idProduct == infoProduct.id);
        let imgUrl = (isSelected[0] ? "../assets/icons/selected-to-buy.svg" : "../assets/icons/add_to_cart.svg");

        concatArticles += `<article data-product="${infoProduct.id}" class="article-section-item">
                                <div onclick="showProductDetails('${infoProduct.id}')" class="article-section-item__img new-img" style="background-image: url('${infoProduct.imgs[0].img}');">
                                </div>
                                <div class="article-section-item__content ${isSelected[0] ? 'clickedBtn' : ''}">
                                    <div class="card-text">
                                        <span class="grey__message price-product">${becomeDollar(infoProduct.price)}</span>
                                        <span class="green__message name-product">${capitalizeAll(infoProduct.name)}</span>
                                    </div>
                                    <div class="circle-border"></div>
                                    <img id="${infoProduct.id}" class="add_to_card" onclick="addToCardBtn('${infoProduct.id}')" src="${imgUrl}" alt="image of a shopping car">
                                </div>
                            </article>`;
    }
    const fiveTails = `<div class="filler"></div><div class="filler"></div><div class="filler"></div><div class="filler"></div><div class="filler"></div>`;
    wrapperProducts.innerHTML = concatArticles + fiveTails;
    if(concatArticles == "") {
        wrapperProducts.innerHTML = `<img src="../assets/icons/noresults.png" class="not-found-icon" alt="icon that indicates that there are no results">`;
    }
}


function showProductsSelected() {
    let concatArticles = "", count = 0;

    if(getCurrentIds() == "") {
        wrapperHomeShoppItems.innerHTML = `<img class="noshop-icon" src="../assets/icons/noshop.svg" alt="image of shopping car">`;
        totalTable.innerHTML = "$ 0,00";
    }

    if(lastIds != getCurrentIds()) { 
        lastIds = "";

        for(let current in userData.currentSelectedProducts) {
            var infoProduct = null;
            let currentID = userData.currentSelectedProducts[current].idProduct;
            lastIds += currentID;
    
            for(let obj in arrayProducts) {
                if(arrayProducts[obj].id == currentID) {
                    infoProduct = arrayProducts[obj];
                    count += infoProduct.price;
                    concatArticles += "<article class='shopping-card-item'>" +
                                            "<div class='front-container'>" +
                                                "<div class='image-border' style='background-image: url(" + infoProduct.imgs[0].img + ");'></div>" +
                                                "<span class='name-product'>" + capitalizeAll(infoProduct.name) + "</span>" +
                                            "</div>" +
                                            "<div class='back-container'>" +
                                                "<span class='price-product'>" + becomeDollar(infoProduct.price) + "</span>" +
                                                "<img onclick='deleteItem(this)' data-product='" + infoProduct.id + "' class='close-icon close-item' src='../assets/icons/x-icon.svg' alt='close item'>" +
                                            "</div>" +
                                        "</article>";
                    break;
                }
            }
        }
        if(concatArticles != "") { 
            wrapperHomeShoppItems.innerHTML = concatArticles;
            totalTable.innerHTML = becomeDollar(count);
        }
    }
}

function deleteItem(myItem) {
    const father = myItem.parentElement;
    const article = father.parentElement;
    let itemID = myItem.dataset.product;
    let newFilter = userData.currentSelectedProducts.filter(item => item.idProduct != itemID);
    userData.currentSelectedProducts = newFilter;
    article.classList.add("deleted-item");
    setTimeout(() => {
        showProductsSelected();
        addToCardBtn(itemID);
    }, 300);
}

function getCurrentIds() {
    let stringIds = "";
    for(let current in userData.currentSelectedProducts) {
        stringIds +=  userData.currentSelectedProducts[current].idProduct;
    }
    return stringIds;
}

function editAccount(myElement) {
    if(myElement.innerHTML != "Save") {
        myElement.innerHTML = "Save";
        myElement.classList.remove("white--btn");
        myElement.classList.add("green--btn");

        for(let input in inputsAccount) {
            if(!isNaN(input)) {
                inputsAccount[input].style.backgroundColor = "#F7F7F7";
                inputsAccount[input].style.paddingLeft = ".7em";
                inputsAccount[input].value = inputsAccount[input].placeholder;
                inputsAccount[input].readOnly = false;
            } else {
                break;
            }
        }
    } else {
        window.location.href = "../views/home.html";
    }
}

function showDetails() {
    window.location.href = "http://127.0.0.1:5500/views/my-order.html";
}

function validateLogin() {
    console.log("trying!!");
    if(validateEmail(userText.value)) { 
        if((userText.value == userData.email) && (passText.value == userData.password)) {
            console.log("Is correct!!");
            window.location.href = "/views/home.html";
        } else {
            console.log("Is wrong!!");
            labelsLogin[0].textContent = "Email address";
            userText.focus();
            showErrorLook(true);
            firstChange = true;
        }
    } else {
        console.log("wrong email given!!");
        labelsLogin[0].textContent = "Enter a valid email address";
        userText.focus();
        showErrorLook(true);
        firstChange = true;
    }
}

function changeUserLogin() {
    if(firstChange) {
        showErrorLook(false);
        firstChange = false;
        console.log("is changing =)!!");
    }
}

function checkLoginText(event) {
    if(event.keyCode == 13) { 
        validateLogin();
    }
}


function showErrorLook(showError) {
    userText.style.border = (showError ? "1px solid #D25050" : "none");
    passText.style.border = (showError ? "1px solid #D25050" : "none");
    btnLogin.disabled = (showError ? "disabled" : false);
    labelsLogin[0].style.color = (showError ? "#D25050" : "#000");
    labelsLogin[1].style.color = (showError ? "#D25050" : "#000");

    if(showError) {
        btnLogin.classList.add("disabled-btn");
        errorMessage.classList.add("show-error-message");
    } else {
        btnLogin.classList.remove("disabled-btn");
        errorMessage.classList.remove("show-error-message");
    }
}


function showProductDetails(idProduct) {
    if(idProduct != previousId) {
        const productInfo = arrayProducts.filter(item => item.id == idProduct);
        detailImgProduct.style.backgroundImage = `url('${productInfo[0].imgs[0].img}')`;
        detailPriceProduct.innerHTML = becomeDollar(productInfo[0].price);
        detailTittleProduct.innerHTML = capitalizeAll(productInfo[0].name);
        detailDescripProduct.innerHTML = productInfo[0].description;
        detailBtn.setAttribute("data-product", idProduct);
        previousId = productInfo[0].id;
    }
    let selected = userData.currentSelectedProducts.filter((item) => item.idProduct == idProduct);
    if(selected[0] != undefined) { 
        detailBtnText.innerHTML = "Remove from cart";
    } else {
        detailBtnText.innerHTML = "Add to cart";
    }
    productDetailWrapper.classList.add("show-product-detail");
    document.body.classList.add("no-scroll");
    calcShoppingTabRightMargin();
}

function hideProductDetail() {
    productDetailWrapper.classList.remove("show-product-detail");
    document.body.classList.remove("no-scroll");
}

function addToShopp(myElement) {
    addToCardBtn(myElement.dataset.product);
    if(detailBtnText.innerHTML == "Remove from cart") {
        detailBtnText.innerHTML = "Add to cart";
    } else {
        detailBtnText.innerHTML = "Remove from cart";
    }
}

function filterHomeProducts(filterType, searchInput) {
    if(filterType != "all") {
        return arrayProducts.filter(item => item.type == filterType);
    } else {
        if(searchInput != "") {
            return getFilteredBySearchProducts(searchInput);
        } else {
            return arrayProducts;
        }
    }
}

function changeFilterSinceNav(filter) {
    const newElement = document.getElementById("js-" + filter + "-mobile");
    handleHomeList(newElement);
    hideMenu();
}

function getFilteredBySearchProducts(inputFilter) {
    return arrayProducts.filter(item => item.name.includes(inputFilter));
}

function searchHandler(event) {
    if(event.target.value == "") {
        if(searchCleanIcon.classList[2]) {
            searchCleanIcon.classList.remove("close-vissible");
        }
    } else if(!searchCleanIcon.classList[2]) {
        searchCleanIcon.classList.add("close-vissible");
    }

    if(event.keyCode == 13) {
        event.preventDefault();       
        if(!itemAllMobile.classList[1]) { 
            const oldSelectedItemMobile = document.querySelector(".selected-item-mobile");
            oldSelectedItemMobile.classList.remove("selected-item-mobile");
            const oldSelectedItemDesk = document.querySelector(".selected-item-desk");
            oldSelectedItemDesk.classList.remove("selected-item-desk");
            itemAllMobile.classList.add("selected-item-mobile");
            itemAllDesk.classList.add("selected-item-desk");
        }
        loadProducts("all", event.target.value);
    }
}

function cleanSearchInput() {
    homeSearchInput.value = "";
    searchCleanIcon.classList.remove("close-vissible");
    homeSearchInput.focus();
}

function handleMenuNav() {
    if(menuNav.classList[1]) {
        menuNav.classList.remove("show-section");
    } else {
        menuNav.classList.add("show-section");
    }
}

function becomeDollar(value) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return formatter.format(value);  
}

function capitalizeAll(str) {
    let arrWords = str.split(" "), result = "";
    for(let i in arrWords) {
        const lower = arrWords[i].toLowerCase();
        result += arrWords[i].charAt(0).toUpperCase() + lower.slice(1) + (arrWords.length - 1 != i ? " " : "");
    }
    return result;
}

function validateEmail(elementValue){      
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue); 
}