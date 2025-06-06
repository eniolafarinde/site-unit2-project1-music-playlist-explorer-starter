// Global array to hold all playlist data. This will be in-memory.
let playlistsData = []; 
let currentSortOrder = 'none'; 
let currentSearchQuery = '';


let currentFormSubmitListener = null; 

// Function to fetch initial data
async function loadInitialPlaylists() {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) {
            console.warn('data/data.json not found or could not be loaded. Starting with empty playlists.');
            playlistsData = []; 
            return;
        }
        const initialPlaylists = await response.json();

        playlistsData = initialPlaylists.map(p => ({
            ...p,
            playlistID: p.playlistID || Date.now() + Math.random(), 
            dateAdded: p.dateAdded || Date.now() 
        }));
        renderFilteredAndSortedPlaylists(); // Rendering them to the UI
    } catch (error) {
        console.error('Error loading initial playlists:', error);
        document.querySelector('.playlist-cards').innerHTML = '<p>Error loading playlists.</p>';
        playlistsData = []; 
    }
}

// Main Rendering Function
function renderFilteredAndSortedPlaylists() {
    let displayedPlaylists = [...playlistsData];

    // 1. Apply Search Filter
    if (currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase();
        displayedPlaylists = displayedPlaylists.filter(playlist => {
            const nameMatch = playlist.playlist_name.toLowerCase().includes(query);
            const authorMatch = playlist.playlist_author.toLowerCase().includes(query);
            return nameMatch || authorMatch;
        });
    }

    // 2. Apply Sorting
    switch (currentSortOrder) {
        case 'name-asc':
            displayedPlaylists.sort((a, b) => a.playlist_name.localeCompare(b.playlist_name));
            break;
        case 'likes-desc':
            displayedPlaylists.sort((a, b) => b.likes - a.likes);
            break;
        case 'date-desc':
            displayedPlaylists.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'none': 
        default:
            displayedPlaylists.sort((a,b) => a.playlistID - b.playlistID); 
            break;
    }

    const container = document.querySelector('.playlist-cards');
    container.innerHTML = ''; 

    if (!displayedPlaylists || displayedPlaylists.length === 0) {
        container.innerHTML = '<p>No playlists found matching your criteria.</p>';
        return;
    }

    displayedPlaylists.forEach(playlist => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" class="playlist-cover" />
            <h3>${playlist.playlist_name}</h3>
            <p>By ${playlist.playlist_author}</p>
            <div class="card-actions">
                <button class="like-btn" data-liked="false" data-playlist-id="${playlist.playlistID}">
                    <span class="heart-icon">♡</span>
                    <span class="like-count">${playlist.likes || 0}</span> likes
                </button>
                <button class="edit-btn" data-playlist-id="${playlist.playlistID}">
                    <i class="fas fa-pencil-alt"></i> Edit
                </button>
                <button class="delete-btn" data-playlist-id="${playlist.playlistID}">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.like-btn') && !e.target.closest('.edit-btn') && !e.target.closest('.delete-btn')) {
                showPlaylistModal(playlist);
            }
        });

        container.appendChild(card);
    });
    setupLikeButtons(); 
    setupEditDeleteButtons(); 
}

function setupLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.removeEventListener('click', handleLikeButtonClick); 
        button.addEventListener('click', handleLikeButtonClick);
    });
}

function handleLikeButtonClick(e) {
    e.stopPropagation(); 
    
    const button = this; 
    const isLiked = button.dataset.liked === 'true';
    const playlistId = button.dataset.playlistId;
    const heartIcon = button.querySelector('.heart-icon');
    const likeCountSpan = button.querySelector('.like-count');
    let currentLikes = parseInt(likeCountSpan.textContent);

    const playlist = playlistsData.find(p => p.playlistID.toString() === playlistId);

    if (playlist) {
        if (isLiked) {
            button.dataset.liked = 'false';
            heartIcon.textContent = '♡';
            heartIcon.style.color = '';
            currentLikes--;
        } else {
            button.dataset.liked = 'true';
            heartIcon.textContent = '♥';
            heartIcon.style.color = '#4a209e';
            currentLikes++;
        }
        playlist.likes = currentLikes; 
        likeCountSpan.textContent = currentLikes; 
    }
}

function setupEditDeleteButtons() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.removeEventListener('click', handleEditButtonClick); 
        button.addEventListener('click', handleEditButtonClick);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.removeEventListener('click', handleDeleteButtonClick); 
        button.addEventListener('click', handleDeleteButtonClick);
    });
}

function handleEditButtonClick(e) {
    e.stopPropagation(); 
    const playlistId = this.dataset.playlistId;
    const playlistToEdit = playlistsData.find(p => p.playlistID.toString() === playlistId);
    if (playlistToEdit) {
        showAddEditPlaylistForm(playlistToEdit); 
    }
}

function handleDeleteButtonClick(e) {
    e.stopPropagation(); 
    const playlistId = this.dataset.playlistId;
    
    if (confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
        deletePlaylist(playlistId);
    }
}

function deletePlaylist(playlistId) {
    playlistsData = playlistsData.filter(p => p.playlistID.toString() !== playlistId);
    renderFilteredAndSortedPlaylists(); 
    const modal = document.getElementById('main-modal');
    if (modal.style.display === 'flex' && modal.dataset.currentPlaylistId == playlistId) {
        modal.style.display = 'none';
    }
}


// Modal Functions

function setupModalCloseListeners() {
    const modal = document.getElementById('main-modal');
    const closeButton = modal.querySelector('.close-modal-btn');
    const modalContent = document.getElementById('modal-content');

    if (closeButton) {
        closeButton.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    modal.onclick = (e) => {
        if (e.target === modal) { 
            modal.style.display = 'none';
        }
    };

    modalContent.onclick = (e) => {
        e.stopPropagation(); 
    };
}


function showPlaylistModal(playlist) {
    const modal = document.getElementById('main-modal');
    const modalContent = document.getElementById('modal-content');
    
    modal.dataset.currentPlaylistId = playlist.playlistID;

    modalContent.innerHTML = `
        <span class="close-modal-btn">&times;</span>
        <div class="modal-header">
            <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" class="modal-playlist-cover" />
            <div class="modal-header-info">
                <h2>${playlist.playlist_name}</h2>
                <p>By ${playlist.playlist_author}</p>
                <p>${playlist.songs ? playlist.songs.length : 0} songs</p>
                <button class="shuffle-btn">🔀 Shuffle Play</button>
            </div>
        </div>
        <div class="modal-body">
            <h3>Songs</h3>
            <ul class="song-list">
                ${playlist.songs && playlist.songs.length > 0 ? playlist.songs.map(song => `
                    <li>
                        <span class="song-title">${song.title}</span>
                        <span class="song-artist">${song.artist}</span>
                        <span class="song-duration">${song.duration}</span>
                    </li>
                `).join('') : '<p>No songs in this playlist.</p>'}
            </ul>
        </div>
    `;
    
    modal.style.display = 'flex'; 

    setupModalCloseListeners(); 

    const shuffleBtn = modalContent.querySelector('.shuffle-btn');
    const songList = modalContent.querySelector('.song-list');
    
    let currentSongsOrder = [...(playlist.songs || [])]; 

    shuffleBtn.addEventListener('click', () => {
        if (currentSongsOrder.length > 0) {
            currentSongsOrder.sort(() => Math.random() - 0.5);
            
            songList.innerHTML = currentSongsOrder.map(song => `
                <li>
                    <span class="song-title">${song.title}</span>
                    <span class="song-artist">${song.artist}</span>
                    <span class="song-duration">${song.duration}</span>
                </li>
            `).join('');
        }
    });
}


//Re-usable Add/Edit Playlist Form Function 
function showAddEditPlaylistForm(playlistToEdit = null) {
    const modal = document.getElementById('main-modal');
    const modalContent = document.getElementById('modal-content');

    const isEditing = playlistToEdit !== null;
    const formTitle = isEditing ? 'Edit Playlist' : 'Create New Playlist';
    const submitButtonText = isEditing ? 'Save Changes' : 'Create Playlist';

    modalContent.innerHTML = `
        <span class="close-modal-btn">&times;</span>
        <h2>${formTitle}</h2>
        <form id="add-edit-playlist-form" class="add-playlist-form">
            <div class="form-group">
                <label for="playlist-name">Playlist Name:</label>
                <input type="text" id="playlist-name" value="${isEditing ? playlistToEdit.playlist_name : ''}" required>
            </div>
            <div class="form-group">
                <label for="playlist-author">Author:</label>
                <input type="text" id="playlist-author" value="${isEditing ? playlistToEdit.playlist_author : ''}" required>
            </div>
            <div class="form-group">
                <label for="playlist-art">Cover Image:</label>
                <input type="file" id="playlist-art" accept="image/*">
                <p class="small-text">${isEditing && playlistToEdit.playlist_art ? 'Leave blank to keep current image.' : 'Required for new playlists.'}</p>
                <img id="image-preview" src="${isEditing && playlistToEdit.playlist_art ? playlistToEdit.playlist_art : ''}" 
                     alt="Image Preview" 
                     style="max-width: 100px; max-height: 100px; margin-top: 10px; border-radius: 5px; display: ${isEditing && playlistToEdit.playlist_art ? 'block' : 'none'};">
            </div>

            <h3>Songs</h3>
            <div id="songs-container">
                ${isEditing && playlistToEdit.songs && playlistToEdit.songs.length > 0 ? playlistToEdit.songs.map(song => `
                    <div class="song-input">
                        <input type="text" placeholder="Song Title" class="song-title" value="${song.title}" required>
                        <input type="text" placeholder="Artist" class="song-artist" value="${song.artist}" required>
                        <input type="text" placeholder="Duration (e.g. 3:45)" class="song-duration" value="${song.duration}" required>
                        <button type="button" class="remove-song-btn">Remove</button>
                    </div>
                `).join('') : `
                    <div class="song-input">
                        <input type="text" placeholder="Song Title" class="song-title" required>
                        <input type="text" placeholder="Artist" class="song-artist" required>
                        <input type="text" placeholder="Duration (e.g. 3:45)" class="song-duration" required>
                        <button type="button" class="remove-song-btn">Remove</button>
                    </div>
                `}
            </div>
            <button type="button" id="add-song-btn" class="add-song-btn">Add Another Song</button>
            <button type="submit" class="submit-btn">${submitButtonText}</button>
        </form>
    `;

    modal.style.display = 'flex'; 
    setupModalCloseListeners(); 

    // Image preview logic
    const playlistArtInput = document.getElementById('playlist-art');
    const imagePreview = document.getElementById('image-preview');

    playlistArtInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result; 
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file); 
        } else {
            if (!isEditing || !playlistToEdit.playlist_art) {
                 imagePreview.src = '';
                 imagePreview.style.display = 'none';
            }
        }
    });

    // Add song button listener
    document.getElementById('add-song-btn').addEventListener('click', () => {
        const songContainer = document.getElementById('songs-container');
        const newSongDiv = document.createElement('div');
        newSongDiv.className = 'song-input';
        newSongDiv.innerHTML = `
            <input type="text" placeholder="Song Title" class="song-title" required>
            <input type="text" placeholder="Artist" class="song-artist" required>
            <input type="text" placeholder="Duration (e.g. 3:45)" class="song-duration" required>
            <button type="button" class="remove-song-btn">Remove</button>
        `;
        songContainer.appendChild(newSongDiv);
        setupRemoveSongButtons(); 
    });

    // Setup remove song buttons initially and whenever new songs are added
    function setupRemoveSongButtons() {
        document.querySelectorAll('.remove-song-btn').forEach(button => {
            button.onclick = function() {
                const songInputs = document.querySelectorAll('.song-input');
                if (songInputs.length > 1 || !isEditing) { 
                    this.closest('.song-input').remove();
                } else if (songInputs.length === 1 && isEditing) {
                    alert('Playlists must have at least one song.');
                }
            };
        });
    }
    setupRemoveSongButtons(); 

    const addEditPlaylistForm = document.getElementById('add-edit-playlist-form');

    if (currentFormSubmitListener) {
        addEditPlaylistForm.removeEventListener('submit', currentFormSubmitListener);
    }

    currentFormSubmitListener = function (e) {
        e.preventDefault();

        const name = document.getElementById('playlist-name').value;
        const author = document.getElementById('playlist-author').value;
        const coverImageFile = document.getElementById('playlist-art').files[0]; 

        const songs = Array.from(document.querySelectorAll('.song-input')).map(songDiv => ({
            title: songDiv.querySelector('.song-title').value,
            artist: songDiv.querySelector('.song-artist').value,
            duration: songDiv.querySelector('.song-duration').value
        }));

        let finalPlaylistArt = isEditing ? playlistToEdit.playlist_art : null; 
        
        if (coverImageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                finalPlaylistArt = event.target.result; 
                processPlaylistSubmission(name, author, finalPlaylistArt, songs, isEditing, playlistToEdit);
            };
            reader.readAsDataURL(coverImageFile);
        } else {
            if (!isEditing && !finalPlaylistArt) { 
                alert('Please select a cover image for the new playlist!');
                return;
            }
            processPlaylistSubmission(name, author, finalPlaylistArt, songs, isEditing, playlistToEdit);
        }
    };

    addEditPlaylistForm.addEventListener('submit', currentFormSubmitListener);
}

function processPlaylistSubmission(name, author, art, songs, isEditing, playlistToEdit) {
    if (isEditing) {
        const index = playlistsData.findIndex(p => p.playlistID === playlistToEdit.playlistID);
        if (index !== -1) {
            playlistsData[index] = {
                ...playlistsData[index], 
                playlist_name: name,
                playlist_author: author,
                playlist_art: art,
                songs: songs
            };
        }
    } else {
        const newPlaylist = {
            playlistID: Date.now(), 
            playlist_name: name,
            playlist_author: author,
            playlist_art: art,
            likes: 0, 
            songs: songs,
            dateAdded: Date.now() 
        };
        playlistsData.unshift(newPlaylist);
    }
    
    renderFilteredAndSortedPlaylists(); 
    document.getElementById('main-modal').style.display = 'none'; 

    const modal = document.getElementById('main-modal');
    if (isEditing && modal.style.display === 'flex' && modal.dataset.currentPlaylistId == playlistToEdit.playlistID) {
        showPlaylistModal(playlistsData.find(p => p.playlistID === playlistToEdit.playlistID));
    }
}


//  Search and Sort Event Listeners
function setupSearchAndSortListeners() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const clearSearchButton = document.getElementById('clear-search-btn');
    const sortSelect = document.getElementById('sort-select');

    searchButton.addEventListener('click', () => {
        currentSearchQuery = searchInput.value.trim();
        renderFilteredAndSortedPlaylists();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearchQuery = searchInput.value.trim();
            renderFilteredAndSortedPlaylists();
        }
    });

    clearSearchButton.addEventListener('click', () => {
        searchInput.value = ''; 
        currentSearchQuery = ''; 
        renderFilteredAndSortedPlaylists(); 
    });

    sortSelect.addEventListener('change', () => {
        currentSortOrder = sortSelect.value;
        renderFilteredAndSortedPlaylists(); 
    });
}


// Event Listeners and Initial Load

document.addEventListener('DOMContentLoaded', () => {
    loadInitialPlaylists(); 
    setupSearchAndSortListeners(); 

    const addPlaylistButton = document.getElementById('add-playlist-btn');
    if (addPlaylistButton) {
        addPlaylistButton.addEventListener('click', () => showAddEditPlaylistForm()); 
    }
});