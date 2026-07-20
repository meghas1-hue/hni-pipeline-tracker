const STAGES = [
  "Prospect",
  "Contact",
  "Meeting",
  "Visit",
  "Proposal",
  "Funding",
  "Stewardship"
];

function renderPipeline(currentStage){

    const container =
      document.getElementById("pipeline-container");

    container.innerHTML = "";

    if(
      currentStage === "Not Interested" ||
      currentStage === "Not Interested / Closed"
    ){

        container.innerHTML = `
          <div class="not-interested">
              ❌ Not Interested
          </div>
        `;

        return;
    }

    const currentIndex =
      STAGES.indexOf(currentStage);

    let html = `
      <div class="pipeline-card">
      <div class="pipeline-title">
        Pipeline Status
      </div>

      <div class="pipeline">
    `;

    STAGES.forEach((stage,index)=>{

        let css = "pending";
        let icon = "";

        if(index < currentIndex){

            css = "completed";
            icon = "✓";

        }else if(index === currentIndex){

            css = "current";
            icon = "•";
        }

        html += `
            <div class="stage">

                <div class="circle ${css}">
                    ${icon}
                </div>

                <div class="label">
                    ${stage}
                </div>

            </div>
        `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
}

/*
==================================================
LOOKER STUDIO DATA
==================================================
*/

dscc.subscribeToData(draw,{
    transform: dscc.objectTransform
});

function draw(data){

    try{

        const rows = data.tables.DEFAULT;

        if(!rows || rows.length === 0){

            renderPipeline("Prospect");
            return;
        }

        const row = rows[0];

        const currentStage =
            row["Current Stage"];

        renderPipeline(currentStage);

    }catch(error){

        console.error(error);

        renderPipeline("Prospect");
    }
}