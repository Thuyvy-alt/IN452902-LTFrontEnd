// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });


// Các phần tử trên trang
const form = document.querySelector('#search-form');
const keywordInput = document.querySelector('#keyword');
const statusEl = document.querySelector('#status');
const listEl = document.querySelector('#event-list');

const ID_WORKSHOP_GIT = '22222222-2222-4222-8222-000000000001';

// Câu 2a: trả về "Còn 12/40 chỗ" hoặc "Hết chỗ"
const formatSeats = (event) => {
  const remaining = event.capacity - event.registeredCount;
  return remaining > 0 ? `Còn ${remaining}/${event.capacity} chỗ` : 'Hết chỗ';
};

// Câu 2b: tạo card bằng createElement, thay nội dung bằng replaceChildren
const renderEvents = (events) => {
  const cards = events.map((event) => {
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    const laWorkshopGit = event.id === ID_WORKSHOP_GIT;
    img.setAttribute('src', laWorkshopGit ? 'img/anh1.png' : 'img/event.svg');
    img.setAttribute('alt', 'Ảnh minh hoạ sự kiện');


    const title = document.createElement('h2');
    const link = document.createElement('a');
    link.setAttribute('href', `event-detail.html?id=${encodeURIComponent(event.id)}`);
    link.textContent = event.name;
    title.append(link);

    const timeP = document.createElement('p');
    const time = document.createElement('time');
    time.setAttribute('datetime', event.startTime);
    time.textContent = formatDateTime(event.startTime);
    timeP.append(time);

    const locationP = document.createElement('p');
    locationP.textContent = event.location;

    const seatsP = document.createElement('p');
    const seatsText = formatSeats(event);
    if (seatsText === 'Hết chỗ') {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = seatsText;
      seatsP.append(badge);
    } else {
      seatsP.textContent = seatsText;
    }

    card.append(img, title, timeP, locationP, seatsP);
    return card;
  });

  listEl.replaceChildren(...cards);
};

// Câu 2c: gọi API, hiện trạng thái
const loadEvents = async (keyword = '') => {
  statusEl.textContent = 'Đang tải…';

  const params = new URLSearchParams({ pageSize: 50 });
  if (keyword !== '') params.set('q', keyword);

  try {
    const response = await fetch(`${API_URL}/api/events?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    renderEvents(data.items);

    statusEl.textContent = data.items.length === 0
      ? 'Không có sự kiện nào khớp từ khoá.'
      : `Tìm thấy ${data.totalCount} sự kiện`;
  } catch (error) {
    console.error(error);
    listEl.replaceChildren();
    statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại.';
  }
};

// Gửi form: chặn tải lại trang, cắt khoảng trắng từ khoá
form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadEvents(keywordInput.value.trim());
});

// Gọi khi mở trang
loadEvents();

