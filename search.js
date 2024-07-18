let currentPage = 1;
const resultsPerPage = 10; 
const maxPagesToShow = 5;

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
        document.getElementById('searchTitle').textContent += ` - "${query}"에 관련된 책 리스트 입니다`;
        searchBooks(query);
    }
});

async function searchBooks(query) {
    const apiKey = 'ttbj01022761248001';
    const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${apiKey}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=${resultsPerPage}&start=${(currentPage - 1) * resultsPerPage + 1}&SearchTarget=Book&Sort=SalesPoint&output=JS&Version=20131101`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.item);
        displayPagination(data.totalResults);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResults(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (books && books.length > 0) {
        books.forEach((book, index) => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const bookImg = document.createElement('img');
            bookImg.src = book.cover;
            bookImg.alt = book.title;

            const bookInfo = document.createElement('div');
            bookInfo.classList.add('book-info');

            const bookTitle = document.createElement('h3');
            bookTitle.textContent = `${(currentPage - 1) * resultsPerPage + index + 1}. ${book.title}`;

            const bookPrice = document.createElement('p');
            bookPrice.textContent = `가격: ${book.priceStandard}원`;

            const bookPubDate = document.createElement('p');
            bookPubDate.textContent = `출판일: ${book.pubDate}`;

            const bookSummary = document.createElement('p');
            bookSummary.textContent = book.description;

            bookDiv.onclick = () => {
                alert(`상세보기: ${book.title}`);
            };

            bookInfo.appendChild(bookTitle);
            bookInfo.appendChild(bookPrice);
            bookInfo.appendChild(bookPubDate);
            bookInfo.appendChild(bookSummary);
            bookDiv.appendChild(bookImg);
            bookDiv.appendChild(bookInfo);
            resultsDiv.appendChild(bookDiv);
        });
    } else {
        resultsDiv.textContent = '검색 결과가 없습니다.';
    }
}

function displayPagination(totalResults) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Clear previous pagination

    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const currentGroup = Math.ceil(currentPage / maxPagesToShow);

    const startPage = (currentGroup - 1) * maxPagesToShow + 1;
    const endPage = Math.min(currentGroup * maxPagesToShow, totalPages);

    if (currentGroup > 1) {
        const firstButton = createPaginationButton('<<', () => goToPage(1));
        const prevButton = createPaginationButton('<', () => goToPage(startPage - 1));
        paginationDiv.appendChild(firstButton);
        paginationDiv.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPaginationButton(i, () => goToPage(i));
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        paginationDiv.appendChild(pageButton);
    }

    if (currentGroup < Math.ceil(totalPages / maxPagesToShow)) {
        const nextButton = createPaginationButton('>', () => goToPage(endPage + 1));
        const lastButton = createPaginationButton('>>', () => goToPage(totalPages));
        paginationDiv.appendChild(nextButton);
        paginationDiv.appendChild(lastButton);
    }
}

function createPaginationButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = () => {
        onClick();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return button;
}

function goToPage(page) {
    currentPage = page;
    const query = new URLSearchParams(window.location.search).get('query');
    searchBooks(query);
}
