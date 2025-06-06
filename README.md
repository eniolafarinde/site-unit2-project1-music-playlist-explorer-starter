📝 `NOTE` Use this template to initialize the contents of a README.md file for your application. As you work on your assignment over the course of the week, update the required or stretch features lists to indicate which features you have completed by changing `[ ]` to `[x]`. (🚫 Remove this paragraph before submitting your assignment.)

Unit Assignment: Music Playlist Explorer

Submitted by: Eniola Farinde

Estimated time spent: 40 - 45 hours spent in total

Deployed Application: [Music Playlist Explorer Deployed Site](https://site-unit2-project1-music-playlist-4q28.onrender.com)

### Application Features

#### CORE FEATURES

- [*] **Display Playlists**
  - [*] Dynamically render playlists on the homepage using JavaScript.
    - [*] Playlists should be shown in grid view.
    - [*] Playlist images should be reasonably sized (at least 6 playlists on your laptop when full screen; large enough that the playlist components detailed in the next feature are legible).
  - [*] Fetch data from a provided Javascript file and use it to create interactive playlist tiles.

- [*] **Playlist Components**
  - [*] Each tile should display the playlist's:
    - [*] Cover image
    - [*] Name
    - [*] Author
    - [*] Like count

- [*] **Playlist Details**
  - [*] Create a modal pop-up view that displays detailed information about a playlist when a user clicks on a playlist tile.
  - [*] The modal should show the playlist's:
    - [*] Cover image
    - [*] Name
    - [*] Author
    - [*] List of songs, including each song's:
      - [*] Title
      - [*] Artist
      - [*] Duration
  - [*] The modal itself should:
    - [*] Not occupy the entire screen.
    - [*] Have a shadow to show that it is a pop-up.
    - [*] Appear floating on the screen.
    - [*] The backdrop should appear darker or in a different shade.

- [*] **Like Playlists**
  - [*] Implement functionality to allow users to like playlists by clicking a heart icon on each playlist tile.
  - [*] When the heart icon is clicked:
    - [*] If previously unliked:
      - [*] The like count on the playlist tile should increase by 1.
      - [*] There should be visual feedback (such as the heart turning a different color) to show that the playlist has been liked by the user.
    - [*] If previously liked:
      - [*] The like count on the playlist tile should decrease by 1.
      - [*] There should be visual feedback (such as the heart turning a different color) to show that the playlist has been unliked by the user.
    - [*] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** In addition to showcasing the above features, for ease of grading, please film yourself liking and unliking:
      - [*] a playlist with a like count of 0
      - [*] a playlist with a non-zero like count

- [*] **Shuffle Songs**
  - [*] Enable users to shuffle the songs within a playlist using a shuffle button in the playlist's detail modal.
  - [*] When the shuffle button is clicked, the playlist's songs should display in a different order.
  - [*] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** In addition to showcasing the above features, for ease of grading, please show yourself shuffling the same playlist more than once. 
  
- [*] **Featured Page**
  - [*] Application includes a dedicated page that randomly selects and displays a playlist, showing the playlist’s:
    - [*] Playlist Image
    - [*] Playlist Name
    - [*] List of songs, including each song's:
      - [*] Title
      - [*] Artist
      - [*] Duration
  - [*] When the page is refreshed or reloaded, a new random playlist is displayed
    - For example, navigating to the all playlists page and then back to the featured playlist page should result in a new random playlist being displayed
    - Note that because your algorithm will not be truly random, it is possible that the same playlist will feature twice in a row. 
    - [*] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** In addition to showcasing the above features, for ease of grading, please show yourself refreshing the featured page more than once. 
  - [*] Application includes a navigation bar or some other mechanism such that users can navigate to the page with all playlists from the featured page and vice versa without using the browser's back and forward buttons. 

#### STRETCH FEATURES

- [*] **Add New Playlists**
  - [*] Allow users to create new playlists.
  - [*] Using a form, users can input playlist:
    - [*] Name
    - [*] Author
    - [*] Cover image
    - [*] Add one or more songs to the playlist, specifying the song's:
      - [*] Title
      - [*] Artist
  - [*] The resulting playlist should display in the grid view.
  - [*] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** For ease of grading, please show yourself adding at least two songs to the playlist. 

- [*] **Edit Existing Playlists**
  - [*] Enable users to modify the details of existing playlists.
  - [*] Add an edit button to each playlist tile.
  - [*] Users can update the playlist:
    - [*] Name
    - [*] Author
    - [*] Songs
  - [*] The playlist grid view and playlist detail modal should update to display any changes (see Required Features, Criterion 1 & 2).
  - [*] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS:** For ease of grading, please show yourself:
    - [*] Editing all of a playlist's features (name, creator, AND songs)
    - [*] Editing some of a playlist's features (name, creator, OR songs) 

- [*] **Delete Playlists**
  - [*] Add a delete button to each playlist tile within the grid view.
  - [*tltf] When clicked, the playlist is removed from the playlist grid view.
    
- [*] **Search Functionality**
  - [*] Implement a search bar that allows users to filter playlists by:
    - [*] Name 
    - [*] Author
  - [*] The search bar should include:
    - [*] Text input field
    - [*] Submit/Search Button
    - [*] Clear Button
  - [*] Playlists matching the search query in the text input are displayed in a grid view when the user:
    - [*] Presses the Enter Key
    - [*] Clicks the Submit/Search Button 
  - [*] User can click the clear button. When clicked:
    - [*] All text in the text input field is deleted
    - [*] All playlists in the `data.json` file are displayed in a grid view
    

- [*] **Sorting Options**
  - [*] Implement a drop-down or button options that allow users to sort the playlist by:
    - [*] Name (A-Z alphabetically)
    - [*] Number of likes (descending order)
    - [*] Date added (most recent to oldest, chronologically)
  - [*] Selecting a sort option should result in a reordering based on the selected sort while maintaining a grid view.

### Walkthrough Video

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/f742dd847c3f47a1909160f9eeb108b0?sid=f358cf0f-8981-4679-9120-6f22bc64e5cc" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>`

Reflection
Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

The topics discussed prepared me to complete the assignment.

If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.
  
If I had more time, I would add additional features like sign up/ log in and a working database. 

* Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?

During my project demo, my project loaded well and the features loaded properly.


### Shout out
I would like to shout out to Greg Miller, my Tech Fellow who helped me go through a problem that I had. 
I would also like to shout out to Kaushik Mishra, my Intern Peer who helped me look through my code to ensure it is clean and helped me prepare for my demo.
Shout out to Vaneesa Ezeh and Mercy Fisayo Akinyemi, my metaU peers. 
