// Convert XP amount to MB/KB and return formatted string
export function formatSize(amount) {
    const mb = amount / (1024 * 1024);
    if (mb >= 1) {
        return `${(Math.round((mb + Number.EPSILON) * 10) / 10).toFixed(1)} MB`; // ✅ Fix floating-point rounding
    }
    const kb = amount / 1024;
    return `${kb.toFixed(0)} kB`; // ✅ Convert to KB if < 1MB
}

// Utility function to captilise first letter of word
export function captiliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Utility function to title case first letter of word
export function titleCase(string) {
    return string.
        toLowerCase().
        split(' ').
        map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Debug helper: Logs grouped skill XP totals in kilobytes
export function debugSkillData(transactions) {
    const skillTx = transactions.filter(tx => tx.type.startsWith("skill_"));
    const grouped = {};

    for (const tx of skillTx) {
        const skill = tx.type.replace("skill_", "");
        grouped[skill] = (grouped[skill] || 0) + tx.amount;

        const summary = Object.entries(grouped).map(([skill, amt]) => ({
            skill,
            amount: `${(amt / 1024).toFixed(1)} kB`
        }));

        console.table(summary);
        return summary;
    }
}

// Get top N skills from transaction data
export function getTopSkills(transactions, limit = 10) {
    const skillPrefix = "skill_";
    const skills = {};

    for (const tx of transactions) {
        if (tx.type.startsWith(skillPrefix)) {
            const skillName = tx.type.replace(skillPrefix, "");
            skills[skillName] = (skills[skillName] || 0) + tx.amount;
        }
    }

    // Convert to array and sort by value descending
    return Object.entries(skills)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
}

// Generate vertical SVG bars for skills
export function renderSkillChart(skills) {
    const svg = document.getElementById("skills-chart");
    svg.innerHTML = ""; // Clear previous content

    const barWidth = 40;
    const barSpacing = 20;
    const padding = 40;
    const chartHeight = 200;

    const maxValue = Math.max(...skills.map(skill => skill[1]));

    skills.forEach((skill, index) => {
        const [name, value] = skill;
        const height = (value / maxValue) * chartHeight;
        const x = padding + index * (barWidth + barSpacing);
        const y = chartHeight - height + padding;

        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.setAttribute("x", x);
        bar.setAttribute("y", y);
        bar.setAttribute("width", barWidth);
        bar.setAttribute("height", height);
        bar.setAttribute("rx", 4);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x + barWidth / 2);
        label.setAttribute("y", chartHeight + padding + 15);
        label.setAttribute("text-anchor", "middle");
        label.textContent = titleCase(name);

        const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueLabel.setAttribute("x", x + barWidth / 2);
        valueLabel.setAttribute("y", y - 5);
        valueLabel.setAttribute("text-anchor", "middle");
        valueLabel.textContent = `${(value / 1024).toFixed(1)} kB`;

        svg.appendChild(bar);
        svg.appendChild(label);
        svg.appendChild(valueLabel);
    });

    // Add horizontal gridlines
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
        const gridY = padding + (i * chartHeight) / gridCount;
        const value = ((1 - i / gridCount) * maxValue) / 1024;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", padding / 2);
        line.setAttribute("x2", padding + skills.length * (barWidth + barSpacing));
        line.setAttribute("y1", gridY);
        line.setAttribute("y2", gridY);
        line.setAttribute("stroke", "#777");
        line.setAttribute("stroke-dasharray", "2,2");
        svg.appendChild(line);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", padding / 2 - 5);
        label.setAttribute("y", gridY + 4);
        label.setAttribute("text-anchor", "end");
        label.textContent = `${value.toFixed(1)} kB`;
        svg.appendChild(label);
    }

    const totalWidth = padding * 2 + skills.length * (barWidth + barSpacing);
    svg.setAttribute("viewBox", `0 0 ${totalWidth} ${chartHeight + padding * 2}`);
}

// Render XP progression line chart
export function renderXPChart(transactions, svgId) {
    const tooltip = document.getElementById("tooltip");
    const svg = document.getElementById(svgId);
    svg.innerHTML = "";

    const xpTx = transactions.filter(tx => tx.type === "xp");
    const grouped = {};

    // Keep raw date string for proper sorting (yyyy-mm-dd)
    for (const tx of xpTx) {
        const rawDate = new Date(tx.createdAt).toISOString().split("T")[0];
        grouped[rawDate] = (grouped[rawDate] || 0) + tx.amount;
    }

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    const data = sortedDates.map(date => ({
        date: new Date(date),
        label: new Date(date).toLocaleDateString("en-GB"),
        amount: grouped[date],
    }));

    const width = 1000;
    const height = 500;
    const padding = 60;
    const maxXP = Math.max(...data.map(d => d.amount));
    const xStep = (width - padding * 2) / (data.length - 1);
    const yScale = (height - padding * 2) / maxXP;

    const axisColor = "#666";
    const gridLines = 5;

    for (let i = 0; i <= gridLines; i++) {
        const y = padding + i * ((height - padding * 2) / gridLines);
        const yValue = maxXP - (i * maxXP / gridLines);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", padding);
        line.setAttribute("y1", y);
        line.setAttribute("x2", width - padding);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", axisColor);
        line.setAttribute("stroke-dasharray", "2 2");
        svg.appendChild(line);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", 10);
        label.setAttribute("y", y + 4);
        label.setAttribute("fill", "#ccc");
        label.setAttribute("font-size", "10");
        label.textContent = `${(yValue / 1024).toFixed(1)} kB`;
        svg.appendChild(label);
    }

    const points = data.map((d, i) => {
        const x = padding + i * xStep;
        const y = height - padding - d.amount * yScale;
        return { x, y, label: d.label, value: d.amount };
    });

    const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", path);
    pathEl.setAttribute("stroke", "#a855f7");
    pathEl.setAttribute("fill", "none");
    pathEl.setAttribute("stroke-width", "2");
    svg.appendChild(pathEl);

    points.forEach((p, i) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", p.x);
        circle.setAttribute("cy", p.y);
        circle.setAttribute("r", 4);
        circle.setAttribute("fill", "#fff");
        circle.style.cursor = "pointer";

        circle.addEventListener("mouseenter", () => {
            tooltip.innerHTML = `<strong>${p.label}</strong><br>XP: ${(p.value / 1024).toFixed(1)} kB`;
            tooltip.style.opacity = 1;
        });

        circle.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY - 40 + "px";
        });

        circle.addEventListener("mouseleave", () => {
            tooltip.style.opacity = 0;
        });

        svg.appendChild(circle);

        if (i % Math.ceil(points.length / 10) === 0) {
            const dateLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            dateLabel.setAttribute("x", p.x);
            dateLabel.setAttribute("y", height - 10);
            dateLabel.setAttribute("text-anchor", "middle");
            dateLabel.setAttribute("fill", "#ccc");
            dateLabel.setAttribute("font-size", "10");
            dateLabel.textContent = p.label;
            svg.appendChild(dateLabel);
        }

        if (i % 2 === 0 || p.value > maxXP * 0.5) {
            const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            valueLabel.setAttribute("x", p.x);
            valueLabel.setAttribute("y", p.y - 8);
            valueLabel.setAttribute("text-anchor", "middle");
            valueLabel.setAttribute("fill", "#fff");
            valueLabel.setAttribute("font-size", "11");
            valueLabel.textContent = `${(p.value / 1024).toFixed(1)} kB`;
            svg.appendChild(valueLabel);
        }
    });

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}
