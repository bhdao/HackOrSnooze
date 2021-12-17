"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

let currentTab = "";

function navAllStories(evt) {
  if (currentTab == "all") { return };
  console.debug("navAllStories", evt);
  checkForRememberedUser();
  hidePageComponents();
  putStoriesOnPage();
  currentTab = "all";
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  checkForRememberedUser();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submitNavClick() {
  if (currentTab == "submit") { return };
  checkForRememberedUser();
  hidePageComponents();
  $newStoryForm.show();
  $allStoriesList.show();
  currentTab = "submit";
}

$navSubmit.on('click', submitNavClick);

function favoritesNavClick() {
  if (currentTab == "faves") { return };
  hidePageComponents();
  checkForRememberedUser()
  $favoriteStoriesList.empty();
  putFavoriteStoriesOnPage();
  currentTab = "faves";
}

$navFavorites.on('click', favoritesNavClick);

function clearFields() {
  console.debug("clearFields")
  for (let input of document.querySelectorAll(".submitField")) {
    input.value = "";
  };
}