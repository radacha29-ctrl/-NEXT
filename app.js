// =====================================================
// NEXT V0.4
// Pick for Me + Focus + Celebration + Local Storage
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  // =====================================================
  // ELEMENTS
  // =====================================================

  const taskCard = document.getElementById("taskCard");

  const taskName = document.getElementById("taskName");
  const taskNumber = document.getElementById("taskNumber");
  const emptyMessage = document.getElementById("emptyMessage");

  const pickBadge = document.getElementById("pickBadge");
  const pickButton = document.getElementById("pickButton");

  const taskList = document.getElementById("taskList");
  const remainingCount = document.getElementById("remainingCount");

  const showAddTask = document.getElementById("showAddTask");
  const addPanel = document.getElementById("addPanel");
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");

  const startButton = document.getElementById("startButton");

  const pauseButton = document.getElementById("pauseButton");
  const finishButton = document.getElementById("finishButton");

  const focusArea = document.getElementById("focusArea");
  const focusControls = document.getElementById("focusControls");

  const progressRing = document.getElementById("progressRing");

  const timerDisplay = document.getElementById("timerDisplay");
  const focusMessage = document.getElementById("focusMessage");

  const completedCount = document.getElementById("completedCount");
  const streakCount = document.getElementById("streakCount");

  const greeting = document.getElementById("greeting");

  const successCard = document.getElementById("successCard");

  const completedTaskMessage =
    document.getElementById("completedTaskMessage");

  const successCompletedCount =
    document.getElementById("successCompletedCount");

  const nextTaskButton =
    document.getElementById("nextTaskButton");

  const timeButtons =
    document.querySelectorAll(".time-btn");


  // =====================================================
  // DATA
  // =====================================================

  let tasks = [];

  try {

    tasks =
      JSON.parse(
        localStorage.getItem("nextTasks")
      ) || [];

  } catch (error) {

    tasks = [];

  }


  let selectedMinutes = 20;

  let totalSeconds =
    selectedMinutes * 60;

  let timeLeft =
    totalSeconds;


  let timer = null;

  let isRunning = false;

  let isPaused = false;


  // =====================================================
  // TODAY
  // =====================================================

  function getDateKey(date = new Date()) {

    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );

  }


  const todayKey =
    "nextCompleted-" + getDateKey();


  let completed =
    Number(
      localStorage.getItem(todayKey)
    ) || 0;


  // =====================================================
  // GREETING
  // =====================================================

  function updateGreeting() {

    const hour =
      new Date().getHours();


    if (hour < 12) {

      greeting.textContent =
        "สวัสดีตอนเช้า";

    }

    else if (hour < 18) {

      greeting.textContent =
        "สวัสดีตอนบ่าย";

    }

    else {

      greeting.textContent =
        "สวัสดีตอนเย็น";

    }

  }


  // =====================================================
  // SAVE
  // =====================================================

  function saveTasks() {

    localStorage.setItem(
      "nextTasks",
      JSON.stringify(tasks)
    );

  }


  // =====================================================
  // ADD PANEL
  // =====================================================

  showAddTask.addEventListener(
    "click",
    function () {

      addPanel.classList.toggle("show");


      if (
        addPanel.classList.contains("show")
      ) {

        showAddTask.textContent =
          "× ปิด";

        taskInput.focus();

      }

      else {

        showAddTask.textContent =
          "＋ เพิ่มสิ่งที่อยากทำ";

      }

    }
  );


  // =====================================================
  // ADD TASK
  // =====================================================

  function addTask() {

    const title =
      taskInput.value.trim();


    if (!title) {

      taskInput.focus();

      return;

    }


    const newTask = {

      id: Date.now(),

      title: title

    };


    tasks.push(newTask);

    saveTasks();


    taskInput.value = "";

    renderTasks();


    taskInput.focus();

  }


  addTaskButton.addEventListener(
    "click",
    addTask
  );


  taskInput.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Enter") {

        addTask();

      }

    }
  );


  // =====================================================
  // DELETE TASK
  // =====================================================

  function deleteTask(id) {

    if (isRunning) {

      alert(
        "กำลัง Focus อยู่ ทำงานนี้ให้เสร็จก่อนนะ 🌱"
      );

      return;

    }


    tasks =
      tasks.filter(
        function (task) {

          return task.id !== id;

        }
      );


    saveTasks();

    renderTasks();

  }


  // =====================================================
  // RENDER TASKS
  // =====================================================

  function renderTasks() {

    taskList.innerHTML = "";


    const total =
      tasks.length;


    taskNumber.textContent =
      total + " งาน";


    remainingCount.textContent =
      total + " งาน";


    // ไม่มีงาน

    if (total === 0) {

      taskName.textContent =
        "ยังไม่มีงาน";


      emptyMessage.style.display =
        "block";


      startButton.disabled =
        true;


      pickButton.disabled =
        true;


      pickBadge.classList.remove(
        "show"
      );


      const empty =
        document.createElement("div");


      empty.className =
        "no-task";


      empty.textContent =
        "วันนี้ไม่มีงานค้างแล้ว 🎉";


      taskList.appendChild(empty);


      return;

    }


    // มีงาน

    emptyMessage.style.display =
      "none";


    startButton.disabled =
      false;


    pickButton.disabled =
      false;


    // งานแรก = NEXT TASK

    taskName.textContent =
      tasks[0].title;


    tasks.forEach(
      function (task, index) {

        const item =
          document.createElement("div");


        item.className =
          "task-item";


        if (index === 0) {

          item.classList.add(
            "current"
          );

        }


        const dot =
          document.createElement("div");


        dot.className =
          "task-dot";


        const title =
          document.createElement("div");


        title.className =
          "task-title";


        title.textContent =
          task.title;


        const deleteButton =
          document.createElement("button");


        deleteButton.className =
          "delete-task";


        deleteButton.textContent =
          "×";


        deleteButton.title =
          "ลบงาน";


        deleteButton.addEventListener(
          "click",
          function () {

            deleteTask(task.id);

          }
        );


        item.appendChild(dot);

        item.appendChild(title);

        item.appendChild(deleteButton);


        taskList.appendChild(item);

      }
    );

  }


  // =====================================================
  // ✨ PICK FOR ME
  // =====================================================

  pickButton.addEventListener(
    "click",
    pickTask
  );


  function pickTask() {

    if (isRunning) {

      return;

    }


    if (tasks.length === 0) {

      addPanel.classList.add("show");

      showAddTask.textContent =
        "× ปิด";

      taskInput.focus();

      return;

    }


    // ถ้ามีงานเดียว ไม่ต้องสุ่ม

    let randomIndex = 0;


    if (tasks.length > 1) {

      randomIndex =
        Math.floor(
          Math.random() *
          tasks.length
        );


      // พยายามไม่เลือกงานเดิม

      if (randomIndex === 0) {

        randomIndex =
          1 +
          Math.floor(
            Math.random() *
            (tasks.length - 1)
          );

      }

    }


    // เอางานที่เลือกออก

    const selectedTask =
      tasks.splice(
        randomIndex,
        1
      )[0];


    // ย้ายมาเป็นงานแรก

    tasks.unshift(
      selectedTask
    );


    saveTasks();


    // Animation

    taskCard.classList.remove(
      "picking"
    );


    void taskCard.offsetWidth;


    taskCard.classList.add(
      "picking"
    );


    pickBadge.classList.add(
      "show"
    );


    taskName.textContent =
      "กำลังเลือกให้คุณ...";


    pickButton.disabled =
      true;


    setTimeout(
      function () {

        taskName.textContent =
          selectedTask.title;


        pickButton.disabled =
          false;


        renderTasks();


        pickBadge.classList.add(
          "show"
        );

      },
      550
    );

  }


  // =====================================================
  // TIME SELECT
  // =====================================================

  timeButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          if (isRunning) {

            return;

          }


          timeButtons.forEach(
            function (btn) {

              btn.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          selectedMinutes =
            Number(
              button.dataset.time
            );


          totalSeconds =
            selectedMinutes * 60;


          timeLeft =
            totalSeconds;


          updateTimer();

        }
      );

    }
  );


  // =====================================================
  // UPDATE TIMER
  // =====================================================

  function updateTimer() {

    const minutes =
      Math.floor(
        timeLeft / 60
      );


    const seconds =
      timeLeft % 60;


    timerDisplay.textContent =

      String(minutes)
        .padStart(2, "0")

      +

      ":"

      +

      String(seconds)
        .padStart(2, "0");


    let progress = 0;


    if (totalSeconds > 0) {

      progress =

        (
          (totalSeconds - timeLeft)
          /
          totalSeconds
        )

        * 360;

    }


    progressRing.style.setProperty(
      "--progress",
      progress + "deg"
    );

  }


  // =====================================================
  // START FOCUS
  // =====================================================

  startButton.addEventListener(
    "click",
    startFocus
  );


  function startFocus() {

    if (tasks.length === 0) {

      addPanel.classList.add(
        "show"
      );


      showAddTask.textContent =
        "× ปิด";


      taskInput.focus();

      return;

    }


    if (isRunning) {

      return;

    }


    isRunning = true;

    isPaused = false;


    totalSeconds =
      selectedMinutes * 60;


    timeLeft =
      totalSeconds;


    focusArea.classList.add(
      "show"
    );


    focusControls.classList.add(
      "show"
    );


    startButton.style.display =
      "none";


    pickButton.style.display =
      "none";


    pickBadge.classList.remove(
      "show"
    );


    focusMessage.textContent =
      "ทำแค่สิ่งนี้ก็พอ 🌱";


    updateTimer();


    timer =
      setInterval(
        function () {

          if (isPaused) {

            return;

          }


          timeLeft--;


          if (timeLeft < 0) {

            timeLeft = 0;

          }


          updateTimer();


          if (timeLeft <= 0) {

            completeTask();

          }

        },
        1000
      );

  }


  // =====================================================
  // PAUSE
  // =====================================================

  pauseButton.addEventListener(
    "click",
    function () {

      if (!isRunning) {

        return;

      }


      isPaused =
        !isPaused;


      if (isPaused) {

        pauseButton.textContent =
          "▶ ทำต่อ";


        focusMessage.textContent =
          "พักได้ แล้วค่อยกลับมา 🌿";

      }

      else {

        pauseButton.textContent =
          "⏸ พัก";


        focusMessage.textContent =
          "กลับมาแล้ว ลุยต่อ 🔥";

      }

    }
  );


  // =====================================================
  // FINISH
  // =====================================================

  finishButton.addEventListener(
    "click",
    completeTask
  );


  function completeTask() {

    if (!isRunning) {

      return;

    }


    // จำชื่องานก่อนลบ

    const finishedTask =
      tasks.length > 0
        ? tasks[0].title
        : "งานของคุณ";


    clearInterval(timer);


    timer = null;

    isRunning = false;

    isPaused = false;


    // ลบงานแรก

    if (tasks.length > 0) {

      tasks.shift();

      saveTasks();

    }


    // เพิ่ม Completed

    completed++;


    localStorage.setItem(
      todayKey,
      completed
    );


    completedCount.textContent =
      completed + " งาน";


    successCompletedCount.textContent =
      completed + " งาน";


    completedTaskMessage.textContent =
      "✓ " + finishedTask;


    // ซ่อน Task Card

    taskCard.style.display =
      "none";


    // แสดง DONE

    successCard.classList.add(
      "show"
    );


    renderTasks();

    calculateStreak();


    // Scroll ไปหน้า celebration

    successCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  // =====================================================
  // NEXT TASK AFTER DONE
  // =====================================================

  nextTaskButton.addEventListener(
    "click",
    function () {

      successCard.classList.remove(
        "show"
      );


      taskCard.style.display =
        "block";


      resetFocus();


      // ถ้ายังมีงาน
      // ให้ NEXT TASK แรกขึ้นมา

      if (tasks.length > 0) {

        taskName.textContent =
          tasks[0].title;

      }


      taskCard.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }
  );


  // =====================================================
  // RESET FOCUS
  // =====================================================

  function resetFocus() {

    clearInterval(timer);


    timer = null;

    isRunning = false;

    isPaused = false;


    totalSeconds =
      selectedMinutes * 60;


    timeLeft =
      totalSeconds;


    focusArea.classList.remove(
      "show"
    );


    focusControls.classList.remove(
      "show"
    );


    startButton.style.display =
      "block";


    pickButton.style.display =
      "block";


    pauseButton.textContent =
      "⏸ พัก";


    focusMessage.textContent =
      "ทำแค่สิ่งนี้ก็พอ";


    progressRing.style.setProperty(
      "--progress",
      "0deg"
    );


    updateTimer();

    renderTasks();

  }


  // =====================================================
  // STREAK
  // =====================================================

  function calculateStreak() {

    let streak = 0;


    const date =
      new Date();


    for (
      let i = 0;
      i < 365;
      i++
    ) {

      const key =

        "nextCompleted-"

        +

        getDateKey(date);


      const value =
        Number(
          localStorage.getItem(key)
        );


      if (value > 0) {

        streak++;

      }

      else {

        // วันนี้ยังไม่ได้ทำ
        // ไม่ทำลาย streak เมื่อวาน

        if (i !== 0) {

          break;

        }

      }


      date.setDate(
        date.getDate() - 1
      );

    }


    streakCount.textContent =
      streak + " วัน";

  }


  // =====================================================
  // INITIALIZE
  // =====================================================

  function init() {

    updateGreeting();


    completedCount.textContent =
      completed + " งาน";


    successCompletedCount.textContent =
      completed + " งาน";


    renderTasks();

    updateTimer();

    calculateStreak();


    console.log(
      "NEXT V0.4 is running 🚀"
    );

  }


  init();

});
// =====================================================
// PWA SERVICE WORKER
// =====================================================

if ("serviceWorker" in navigator) {

  window.addEventListener("load", function () {

    navigator.serviceWorker
      .register("./service-worker.js")
      .then(function () {

        console.log("NEXT PWA ready 📱");

      })
      .catch(function (error) {

        console.log(
          "Service Worker error:",
          error
        );

      });

  });

}
