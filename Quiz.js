// Initialize when document is ready
$(document).ready(function() {
    // Initialize drag-and-drop sorting
    $("#sortable").sortable();
    $("#sortable").disableSelection();

    // Generate questions dynamically
    const questionsContainer = $("#questions-container");
    const sections = [
        { prefix: '1', count: 14, section: "Identity, Safety & Belonging" },
        { prefix: '2', count: 3, section: "Religion & Cultural Respect" },
        { prefix: '3', count: 8, section: "Communication & Civic Participation" },
        { prefix: '4', count: 7, section: "Education & Learning" },
        { prefix: '5', count: 9, section: "Work, Career & Business" },
        { prefix: '6', count: 12, section: "Lifestyle, Housing & Convenience" },
        { prefix: '7', count: 17, section: "Family, Healthcare & Integration" },
        { prefix: '8', count: 5, section: "Migration Climate & Policy" },
        { prefix: '9', count: 9, section: "Culture, Innovation & Free Time" },
        { prefix: '10', count: 3, section: "Personal Alignment & Emotional Fit" }
    ];

    let questionCounter = 1;
    sections.forEach(sectionGroup => {
        for (let i = 1; i <= sectionGroup.count; i++) {
            const letter = String.fromCharCode(96 + i); // 97 = 'a'
            const questionId = `${sectionGroup.prefix}.${letter}`;
            
            questionsContainer.append(`
                <div class="question">
                    <p>${questionCounter}. Question about ${sectionGroup.section}</p>
                    <div class="rating">
                        <label><input type="radio" name="${questionId}" value="1"> 1</label>
                        <label><input type="radio" name="${questionId}" value="2"> 2</label>
                        <label><input type="radio" name="${questionId}" value="3"> 3</label>
                        <label><input type="radio" name="${questionId}" value="4"> 4</label>
                        <label><input type="radio" name="${questionId}" value="5"> 5</label>
                    </div>
                </div>
            `);
            questionCounter++;
        }
    });

    // Handle form submission
    $("#quiz-form").submit(async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = $(".submit-btn");
        const originalBtnText = submitBtn.text();
        submitBtn.text("Processing...").prop("disabled", true);
        
        // Collect answers
        const answers = {};
        $('input[type="radio"]:checked').each(function() {
            answers[$(this).attr("name")] = parseInt($(this).val());
        });
        
        // Collect rankings
        const rankings = [];
        $("#sortable li").each(function(index) {
            rankings.push({
                area: $(this).data("area"),
                rank: index + 1
            });
        });
        
        // Send to Google Apps Script
        try {
            // YOUR GOOGLE SCRIPT URL
            const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxb_eVY63-2nhB18Bi1LSWNwGshRB5rRwl5yjBdQHvgIKjPRpY7xGqfwHJaQn4zHau9/exec";
            
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers, rankings })
            });
            
            const result = await response.json();
            if (result.success) {
                window.location.href = `thankyou.html?country=${encodeURIComponent(result.country)}`;
            } else {
                alert("Error: " + (result.error || "Unknown error occurred"));
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit: " + error.message);
        } finally {
            // Restore button state
            submitBtn.text(originalBtnText).prop("disabled", false);
        }
    });
});
