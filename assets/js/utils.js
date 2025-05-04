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