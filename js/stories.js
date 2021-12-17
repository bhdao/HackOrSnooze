"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let idMatched;
  let deleteOwnPostButton = "";

  if (currentUser) {
    /* If inputted story is favorited by the current user, adds appropriate class to the element */
    if (currentUser.favorites) {
      for (let faveStory of currentUser.favorites) {
        if (story.storyId == faveStory.storyId) {
          idMatched = true;
        };
      };
    };


    /* If inputted story belongs to current user, adds delete button to the element */
    if (currentUser.ownStories) {
      for (let userStory of currentUser.ownStories) {
        if (story.username == userStory.username) {
          deleteOwnPostButton = (
            `<small class="delete-btn">❌</small>`
          );
        }
      }
    }
  };





  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}" ${deleteOwnPostButton ? "class='current-user-story'" : ""}>
        <span class="favorite-btn ${idMatched ? "faved" : ""}">&#10084;</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        ${deleteOwnPostButton}      
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** modified version of above function but specifically for user-favorited stories */
function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favoriteStoriesList.empty();

  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }

  if (currentUser.favorites.length < 1) {
    $favoriteStoriesList.append("<p>You have no favorited stories! 💔</p>")
  }

  $favoriteStoriesList.show();

}


function addFavoriteStory(e) {
  let id = e.target.parentNode.id;
  currentUser.addFavorite(currentUser, id);
};

function removeFavoriteStory(e) {
  let id = e.target.parentNode.id;
  currentUser.removeFavorite(currentUser, id);
};

async function deleteUserStory(e) {
  let id = e.target.parentNode.id;
  currentUser.removeUserStory(currentUser, id);
};

/*Event listeners for story elements on the page
Used event delegation to minimize creation of event listeners*/
storiesContainer.addEventListener("click", (e) => {

  //If story isn't favorited, sends request to add the story to favorite
  if (e.target.classList.contains("favorite-btn") && !e.target.classList.contains("faved")) {
    e.target.classList.add("faved")
    addFavoriteStory(e);
  }

  //If story is favorited, sends request to remove the story from favorites
  else if (e.target.classList.contains("favorite-btn") && e.target.classList.contains("faved")) {
    console.log(e);
    e.target.classList.remove("faved");
    removeFavoriteStory(e);
  }

  //If it is the current user's story, sends request to delete story
  else if (e.target.classList.contains("delete-btn")) {
    deleteUserStory(e);
    if (!e.target.parentNode.classList.contains("set-delete")) {
      e.target.parentNode.classList.toggle("set-delete");
      const deleteNotice = document.createElement("h3");
      deleteNotice.style.color = "red";
      deleteNotice.textContent = "Deleting story...";
      e.target.parentNode.appendChild(deleteNotice);
    };
  }
});

//Handles functions to be run when submitting a story
$newStoryForm.on("submit", async (e) => {
  e.preventDefault();
  currentUser.postNewStory();
  clearFields();
});