document.addEventListener('DOMContentLoaded', () => {
    // Load all playlists and display a random one
    fetch('data/data.json')
        .then(response => response.json())
        .then(playlists => {
            if (!playlists || playlists.length === 0) {
                document.getElementById('featured-playlist').innerHTML = 
                    '<p>No playlists available.</p>';
                return;
            }

            // Select a random playlist
            const randomIndex = Math.floor(Math.random() * playlists.length);
            const featuredPlaylist = playlists[randomIndex];
            
            // Display the featured playlist
            displayFeaturedPlaylist(featuredPlaylist);
        })
        .catch(error => {
            console.error('Error loading playlists:', error);
            document.getElementById('featured-playlist').innerHTML = 
                '<p>Error loading featured playlist.</p>';
        });

    // Function to display the featured playlist
    function displayFeaturedPlaylist(playlist) {
        const featuredContainer = document.getElementById('featured-playlist');
        
        featuredContainer.innerHTML = `
            <div class="featured-playlist-card">
                <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" 
                     class="featured-playlist-cover">
                <div class="featured-playlist-info">
                    <h2>${playlist.playlist_name}</h2>
                    <p class="playlist-author">By ${playlist.playlist_author}</p>
                    <p class="playlist-song-count">${playlist.songs.length} songs</p>
                </div>
            </div>
            <div class="featured-songs">
                <h3>Songs</h3>
                <ul class="song-list">
                    ${playlist.songs.map(song => `
                        <li class="song-item">
                            <span class="song-title">${song.title}</span>
                            <span class="song-artist">${song.artist}</span>
                            <span class="song-duration">${song.duration}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
});