// Facebook API Configuration
const FACEBOOK_API_VERSION = 'v19.0';
const FACEBOOK_GRAPH_API = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

// Local Storage Keys
const STORAGE_KEY_TOKEN = 'fb_access_token';
const STORAGE_KEY_PAGE_ID = 'fb_page_id';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedConfig();
});

/**
 * Save Facebook configuration to local storage
 */
function saveFacebookConfig() {
    const token = document.getElementById('accessTokenInput').value.trim();
    const pageId = document.getElementById('pageIdInput').value.trim();

    if (!token || !pageId) {
        alert('⚠️ Vui lòng nhập đầy đủ Access Token và ID Trang Facebook');
        return;
    }

    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_PAGE_ID, pageId);

    alert('✅ Cài đặt đã được lưu thành công!');
    loadFacebookPosts();
}

/**
 * Load saved configuration from local storage
 */
function loadSavedConfig() {
    const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    const savedPageId = localStorage.getItem(STORAGE_KEY_PAGE_ID);

    if (savedToken) {
        document.getElementById('accessTokenInput').value = savedToken;
    }
    if (savedPageId) {
        document.getElementById('pageIdInput').value = savedPageId;
    }

    // Auto-load posts if config exists
    if (savedToken && savedPageId) {
        loadFacebookPosts();
    }
}

/**
 * Clear saved configuration
 */
function clearFacebookConfig() {
    if (confirm('⚠️ Bạn chắc chắn muốn xóa cài đặt?')) {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_PAGE_ID);
        document.getElementById('accessTokenInput').value = '';
        document.getElementById('pageIdInput').value = '';
        document.getElementById('postsContainer').innerHTML = '<div class="info-message">Cài đặt đã được xóa. Vui lòng nhập cài đặt mới để xem bài viết.</div>';
        alert('✅ Cài đặt đã được xóa!');
    }
}

/**
 * Load Facebook posts
 */
async function loadFacebookPosts() {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const pageId = localStorage.getItem(STORAGE_KEY_PAGE_ID);

    if (!token || !pageId) {
        alert('⚠️ Vui lòng cấu hình Access Token và ID Trang Facebook trước');
        return;
    }

    const container = document.getElementById('postsContainer');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Đang tải bài viết...</p></div>';

    try {
        const posts = await fetchFacebookPosts(pageId, token);
        displayPosts(posts, container);
    } catch (error) {
        console.error('Error loading posts:', error);
        container.innerHTML = `
            <div class="error-message">
                <strong>❌ Lỗi:</strong> ${error.message}<br>
                <small>Vui lòng kiểm tra Access Token và ID Trang Facebook có đúng không.</small>
            </div>
        `;
    }
}

/**
 * Fetch posts from Facebook Graph API
 */
async function fetchFacebookPosts(pageId, accessToken) {
    const fields = 'id,message,story,picture,link,created_time,type,status_type,full_picture';
    const url = `${FACEBOOK_GRAPH_API}/${pageId}/feed?fields=${fields}&limit=25&access_token=${accessToken}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Lỗi khi tải dữ liệu từ Facebook');
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            throw new Error('Không tìm thấy bài viết nào');
        }

        return data.data;
    } catch (error) {
        throw new Error(error.message || 'Lỗi kết nối Facebook API');
    }
}

/**
 * Display posts in the container
 */
function displayPosts(posts, container) {
    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="no-posts"><p>😔 Không tìm thấy bài viết nào</p></div>';
        return;
    }

    let html = '';

    posts.forEach((post, index) => {
        const postLink = `https://facebook.com/${post.id}`;
        const message = post.message || post.story || 'Bài viết từ Mini Tour Ninh Bình';
        const timestamp = formatDate(post.created_time);
        const image = post.full_picture || post.picture;

        html += `
            <div class="facebook-post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-avatar">📍</div>
                    <div class="post-info">
                        <h6>Mini Tour Ninh Bình</h6>
                        <small>${timestamp}</small>
                    </div>
                </div>

                <div class="post-content">
                    <div class="post-text-preview" id="text-${post.id}">
                        ${escapeHtml(message)}
                    </div>
                    ${message && message.length > 300 ? `
                        <button class="see-more-btn" onclick="togglePostText('${post.id}')">
                            Xem thêm ▼
                        </button>
                    ` : ''}
                </div>

                ${image ? `<img src="${image}" alt="Post image" class="post-image show" onerror="this.style.display='none'">` : ''}

                <div class="post-actions">
                    <a href="${postLink}" target="_blank" class="btn-facebook-link">
                        👍 Xem trên Facebook
                    </a>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Toggle post text visibility
 */
function togglePostText(postId) {
    const textElement = document.getElementById(`text-${postId}`);
    const btn = event.target;

    if (textElement.classList.contains('expanded')) {
        textElement.classList.remove('expanded');
        btn.textContent = 'Xem thêm ▼';
    } else {
        textElement.classList.add('expanded');
        btn.textContent = 'Thu gọn ▲';
    }
}

/**
 * Format date to Vietnamese format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) {
        return 'Vừa xong';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
    } else {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('vi-VN', options);
    }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    if (!text) return '';

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    // Also convert URLs to clickable links
    let escaped = text.replace(/[&<>"']/g, char => map[char]);

    // Convert URLs to clickable links
    escaped = escaped.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" style="color: #1877F2; text-decoration: none;">$1</a>'
    );

    // Convert line breaks to <br>
    escaped = escaped.replace(/\n/g, '<br>');

    return escaped;
}

/**
 * Export posts to JSON (optional feature)
 */
function exportPostsToJSON() {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const pageId = localStorage.getItem(STORAGE_KEY_PAGE_ID);

    if (!token || !pageId) {
        alert('⚠️ Vui lòng cấu hình trước');
        return;
    }

    fetchFacebookPosts(pageId, token).then(posts => {
        const dataStr = JSON.stringify(posts, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facebook_posts_${new Date().getTime()}.json`;
        link.click();
    });
}
