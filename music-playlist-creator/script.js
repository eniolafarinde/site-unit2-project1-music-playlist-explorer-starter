function renderPlaylist() {
    fetch('data/data.json')
        .then(response => response.json())
        .then(playlists => {
            const container = document.querySelector('.playlist-cards');
            container.innerHTML = '';

            if (!playlists || playlists.length === 0) {
                container.innerHTML = '<p>No playlists added.</p>';
            return;
            }

            playlists.forEach(playlist => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" class="playlist-cover" />
                    <h3>${playlist.playlist_name}</h3>
                    <p>By ${playlist.playlist_author}</p>
                    <div class="like-container">
                        <button class="like-btn" data-liked="false">
                            <span class="heart-icon">♡</span>
                            <span class="like-count">${playlist.likes}</span> likes
                        </button>
                    </div>
                `;

                card.addEventListener('click', (e) => {
                    // Don't open modal if clicking the like button
                    if (!e.target.closest('.like-btn')) {
                        showPlaylistModal(playlist);
                    }
                });


                container.appendChild(card);
            });
            setupLikeButtons();
        })

        .catch(error => {
            console.error('Error loading playlists:', error);
            document.querySelector('.playlist-cards').innerHTML = '<p>Error loading playlists.</p>';
        });   
}

function setupLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            
            const isLiked = this.dataset.liked === 'true';
            const heartIcon = this.querySelector('.heart-icon');
            const likeCount = this.querySelector('.like-count');
            
            if (isLiked) {
                // Unlike
                this.dataset.liked = 'false';
                heartIcon.textContent = '♡';
                heartIcon.style.color = '';
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
            } else {
                // Like
                this.dataset.liked = 'true';
                heartIcon.textContent = '♥';
                heartIcon.style.color = '#ff4d4d';
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
            }
        });
    });
}

function showPlaylistModal(playlist) {
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    
    // Populate modal with playlist details
    modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="modal-header">
        <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" class="modal-playlist-cover" />
            <div class="modal-header-info">
                <h2>${playlist.playlist_name}</h2>
                <p>By ${playlist.playlist_author}</p>
                <p>♡ ${playlist.likes} likes</p>
                <p>${playlist.songs ? playlist.songs.length : 0} songs</p>
            </div>
        </div>
        <div class="modal-body">
            <h3>Songs</h3>
            <ul class="song-list">
                ${playlist.songs ? playlist.songs.map(song => `
                    <li>
                        <span class="song-title">${song.title}</span>
                        <span class="song-artist">${song.artist}</span>
                        <span class="song-duration">${song.duration}</span>
                    </li>
                `).join('') : '<p>No songs in this playlist.</p>'}
            </ul>
        </div>
    `;
    
    // Show the modal
    modal.style.display = 'block';
    
    // Close modal when clicking the X button
    const closeButton = modalContent.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
renderPlaylist()
showPlaylistModal(playlist)

