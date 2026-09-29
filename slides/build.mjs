import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const runtimeRequire=createRequire('C:/Users/VICTUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/runtime-anchor.cjs');
const { Presentation, PresentationFile }=await import(pathToFileURL(runtimeRequire.resolve('@oai/artifact-tool')).href);

const workspaceDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=workspaceDir+'/slides';
const stagingDir=workspaceDir+'/.slide-build';
await fs.mkdir(stagingDir,{recursive:true});
const SKILL_DIR='C:/Users/VICTUS/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
const RUNTIME_PYTHON='C:/Users/VICTUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES='C:/Users/VICTUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {finalizePresentation}=await import(pathToFileURL(SKILL_DIR+'/container_tools/artifact_tool_utils.mjs').href);
const presentation=Presentation.create({slideSize:{width:1280,height:720}});
const files=['02_Idea_and_Solution.png','03_Technical_Approach.png','04_Feasibility_and_Viability.png','05_Impact_and_Benefits.png','06_Research_and_References.png'];
const sourceNotes=await fs.readFile(output+'/SIH26130_Copy_Counts_and_Sources.md','utf8');
const copy=JSON.parse(await fs.readFile(output+'/remaining_copy.json','utf8'));
for(let i=0;i<files.length;i++){
  const slide=presentation.slides.add();
  slide.images.add({blob:new Uint8Array(await fs.readFile(output+'/'+files[i])),contentType:'image/png',alt:files[i].replace(/_/g,' '),fit:'contain',position:{left:0,top:0,width:1280,height:720}});
  const key=['idea','technical','feasibility','impact','research'][i];
  slide.speakerNotes.textFrame.setText('SIH26130 — MahaNiyam\nThis slide uses a high-resolution composed image to preserve the matched layout. Text and diagrams are flattened. The source copy, count audit and full reference URLs are provided in the accompanying Markdown file.\n\n'+(copy[key]?.new.join('\n')??'')+'\n\n'+sourceNotes);
}
const candidatePath=stagingDir+'/candidate.pptx';
await(await PresentationFile.exportPptx(presentation)).save(candidatePath);
const result=await finalizePresentation({
  workspaceDir,candidatePath,finalPath:output+`/SIH26130_Matched_Slides_${Date.now()}.pptx`,
  explicitTotalSlideCount:5,
  requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],
  pythonExecutable:RUNTIME_PYTHON,
  integrityValidatorPath:SKILL_DIR+'/container_tools/inspect_presentation_package_integrity.py',
  layoutValidatorPath:SKILL_DIR+'/container_tools/inspect_presentation_layout_geometry.py',
  layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
  verifyArtifactToolImport:true,
  receiptPath:stagingDir+'/validation.json'
});
console.log(JSON.stringify(result));
// Render all five slides through the same presentation engine for output inspection.
for(let i=0;i<files.length;i++){
  const slide=presentation.slides.items[i];
  const preview=await presentation.export({slide,format:'png',scale:1});
  await fs.writeFile(stagingDir+`/render-${i+1}.png`,new Uint8Array(await preview.arrayBuffer()));
}
