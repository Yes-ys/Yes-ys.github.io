document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(
    "#recent-posts-paginator, #other-paginator, #paginator, .pagination"
  );

  containers.forEach((container) => {
    // 1. Create Canvas
    const canvas = document.createElement("canvas");
    canvas.className = "pagination-string-canvas";
    // Insert as first child so it sits behind
    container.insertBefore(canvas, container.firstChild);
    
    const ctx = canvas.getContext("2d");
    let time = 0;

    function resize() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
    window.addEventListener("resize", resize);
    // Call once to init
    resize();

    function animate() {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Identify relevant buttons
      const btns = Array.from(container.children).filter(
        (el) =>
          (el.classList.contains("page-number") || el.classList.contains("extend")) &&
          getComputedStyle(el).display !== "none"
      );

      if (btns.length === 0) {
        requestAnimationFrame(animate);
        return;
      }

      // Calculate center points of each button relative to the container
      const points = btns.map((btn) => ({
        x: btn.offsetLeft + btn.offsetWidth / 2,
        y: btn.offsetTop + btn.offsetHeight / 2,
      }));

      // Add loose ends (tails) to the string
      // Tail starts 150px to the left of the first button
      const startTail = {
        x: points[0].x - 150,
        y: points[0].y + Math.sin(time * 0.8) * 20 // Float up and down
      };

      // Tail ends 150px to the right of the last button
      const endTail = {
        x: points[points.length - 1].x + 150,
        y: points[points.length - 1].y + Math.cos(time * 0.7) * 20
      };

      // Combine all key points: StartTail -> Button Centers -> EndTail
      const allPoints = [startTail, ...points, endTail];

      ctx.beginPath();
      ctx.moveTo(allPoints[0].x, allPoints[0].y);
      
      // Draw curves between points
      // Using quadraticCurveTo to simulate a slack string hanging/floating between beads
      for (let i = 0; i < allPoints.length - 1; i++) {
        const p1 = allPoints[i];
        const p2 = allPoints[i + 1];

        // Midpoint
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;

        // Add dynamic wave offset
        // Frequency varies by index to make it look organic
        const wave = Math.sin(time + i * 0.5) * 8; 
        
        // Control point adds the curve
        // We pull the string vertically based on the wave
        const cpx = mx;
        const cpy = my + wave;

        // Draw it
        ctx.quadraticCurveTo(cpx, cpy, p2.x, p2.y);
      }

      // Style the string
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 3;
      // Gradient or solid color? Let's use a nice dark grey
      ctx.strokeStyle = "rgba(80, 80, 80, 0.4)";
      ctx.stroke();

      requestAnimationFrame(animate);
    }

    animate();
  });
});
