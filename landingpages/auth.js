function authCheck(redirectPage) {
    if (!sessionStorage.getItem("loginSuccess")) {
      window.location.href = redirectPage;
    }
  }