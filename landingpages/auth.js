function authCheck(redirectPage) {
    if (localStorage.getItem("loginSuccess") !== "true") {
      window.location.href = redirectPage;
    }
  }