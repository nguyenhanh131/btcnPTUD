$(function () {
    // ================== 1. KHAI BÁO ==================
    var container = $('#container');
    var bird      = $('#bird');
    var pole      = $('.pole');
    var pole_1    = $('#pole_1');
    var pole_2    = $('#pole_2');
    var score     = $('#score');
    var level_box = $('#level');
    var best_box  = $('#best');
    var message   = $('#message');

    var container_width       = parseInt(container.width());
    var container_height      = parseInt(container.height());
    var pole_initial_position = parseInt(pole.css('right'));   // vị trí ban đầu (ngoài khung bên phải)
    var pole_width            = parseInt(pole.outerWidth());
    var pole_base_height      = parseInt(pole.css('height'));  // chiều cao gốc của mỗi ống
    var bird_left             = parseInt(bird.css('left'));
    var bird_width            = parseInt(bird.width());
    var bird_height           = parseInt(bird.height());

    // ---------- Level (yêu cầu bắt buộc) ----------
    var LEVEL_INTERVAL = {1: 40, 2: 30, 3: 25, 4: 20};  // thời gian mỗi nhịp (ms) theo Level
    var WIN_SCORE = 10;                                  // đạt 50 điểm: thắng

    // ---------- Thông số vật lý (phần nâng cao: chơi mượt hơn) ----------
    var speed       = 6;    // ống đi 6px mỗi nhịp (bản gốc 10px)
    var gravity     = 1;    // trọng lực: chim rơi nhanh dần
    var jump_power  = -10;  // lực vỗ cánh mỗi lần bấm phím
    var max_fall    = 12;   // tốc độ rơi tối đa
    var hit_margin  = 6;    // thu nhỏ vùng va chạm của chim 6px mỗi phía cho dễ chơi
    var gap_random  = 60;   // độ lệch ngẫu nhiên khe hở (±60px)

    // ---------- Trạng thái ----------
    var the_game      = null;   // lưu id của setInterval (để clearInterval đúng cách)
    var started       = false;
    var game_over     = false;
    var score_updated = false;
    var level         = 1;
    var velocity      = 0;
    var bird_top      = parseInt(bird.css('top'));
    var pole_pos      = pole_initial_position;
    var pole_1_h      = pole_base_height;
    var pole_2_h      = pole_base_height;

    // ---------- Kỷ lục (localStorage) ----------
    var best = 0;
    try { best = parseInt(localStorage.getItem('flappy_best')) || 0; } catch (e) {}
    best_box.text('Kỷ lục: ' + best);

    // ================== 2. LEVEL ==================
    // Điểm -> Level: 5 điểm = Level 2, 20 điểm = Level 3, 40 điểm = Level 4
    function levelFromScore(s) {
        if (s >= 40) return 4;
        if (s >= 20) return 3;
        if (s >= 5)  return 2;
        return 1;
    }

    // Đổi Level: cập nhật chữ Level và tạo lại vòng lặp game với Interval mới
    function set_level(l) {
        level = l;
        level_box.text('Level ' + l);
        clearInterval(the_game);
        the_game = setInterval(gameLoop, LEVEL_INTERVAL[l]);
    }

    // ================== 3. VÒNG LẶP GAME ==================
    function gameLoop() {
        // --- Chim: rơi nhanh dần theo trọng lực ---
        velocity = Math.min(velocity + gravity, max_fall);
        bird_top += velocity;
        if (bird_top < 0) { bird_top = 0; velocity = 0; }   // chạm trần: bị chặn lại, không chết
        var angle = Math.max(-25, Math.min(70, velocity * 6));  // nghiêng theo tốc độ
        bird.css({top: bird_top, transform: 'rotate(' + angle + 'deg)'});

        // --- Ống: di chuyển sang trái ---
        pole_pos += speed;
        if (pole_pos > container_width) {            // ống đã ra khỏi khung -> tạo cặp ống mới
            var d = Math.floor(Math.random() * (gap_random * 2 + 1)) - gap_random;
            pole_1_h = pole_base_height + d;
            pole_2_h = pole_base_height - d;
            pole_1.css('height', pole_1_h);
            pole_2.css('height', pole_2_h);
            pole_pos = pole_initial_position;
            score_updated = false;
        }
        pole.css('right', pole_pos);

        // --- Điểm: chim vượt qua cặp ống ---
        if (!score_updated && pole_pos > container_width - bird_left) {
            score_updated = true;
            add_score();
            if (game_over) return;                   // đã thắng thì dừng luôn
        }

        // --- Va chạm: chạm đất hoặc đụng ống ---
        if (bird_top > container_height - bird_height || hit()) {
            stop_the_game(false);
        }
    }

    // Cộng điểm, kiểm tra thắng và đổi Level
    function add_score() {
        var s = parseInt(score.text()) + 1;
        score.text(s);
        if (s >= WIN_SCORE) { stop_the_game(true); return; }
        var l = levelFromScore(s);
        if (l !== level) set_level(l);
    }

    // Va chạm tính bằng toạ độ số (không bị ảnh hưởng khi chim nghiêng)
    function hit() {
        var bx1 = bird_left + hit_margin,               bx2 = bird_left + bird_width - hit_margin;
        var by1 = bird_top + hit_margin,                by2 = bird_top + bird_height - hit_margin;
        var px1 = container_width - pole_pos - pole_width, px2 = px1 + pole_width;
        if (bx2 < px1 || bx1 > px2) return false;       // chưa cùng cột với ống
        return by1 < pole_1_h || by2 > container_height - pole_2_h;  // đụng ống trên hoặc ống dưới
    }

    // ================== 4. BẮT ĐẦU / KẾT THÚC ==================
    function startGame() {
        if (started) return;
        started = true;
        $('#play_btn').hide();
        set_level(1);
    }

    // win = true: thắng | win = false: thua
    function stop_the_game(win) {
        clearInterval(the_game);                     // sửa lỗi gốc: dừng đúng vòng lặp đang chạy
        game_over = true;
        var s = parseInt(score.text());
        if (s > best) {
            best = s;
            best_box.text('Kỷ lục: ' + best);
            try { localStorage.setItem('flappy_best', best); } catch (e) {}
        }
        message.text(win ? '🏆 CHIẾN THẮNG!' : 'Game Over').fadeIn();
        $('#restart_btn').slideDown();
    }

    $('#play_btn').click(startGame);

    $('#restart_btn').click(function () {
        location.reload();
    });

    // ================== 5. PHÍM: thay mousedown bằng keydown (mũi tên xuống) ==================
    $(document).on('keydown', function (e) {
        if (e.which !== 40) return;                  // 40 = phím mũi tên xuống (Arrow Down)
        e.preventDefault();                          // không cho trang cuộn xuống
        if (e.originalEvent && e.originalEvent.repeat) return;  // giữ phím không bị lặp
        if (game_over) return;
        if (!started) startGame();
        velocity = jump_power;                       // vỗ cánh: chim bay lên
    });
});
