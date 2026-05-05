const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'src', 'App.jsx');

if (!fs.existsSync(appPath)) {
  console.error('Could not find src/App.jsx. Put this script in your project root and run: node patch_repair_job_card_layout.cjs');
  process.exit(1);
}

const original = fs.readFileSync(appPath, 'utf8');
const usesCRLF = original.includes('\r\n');
let text = original.replace(/\r\n/g, '\n');

const dashboardStart = text.indexOf('function Dashboard(');
const dashboardEnd = dashboardStart >= 0 ? text.indexOf('function JobSetup(', dashboardStart) : -1;

if (dashboardStart < 0 || dashboardEnd < 0) {
  console.error('Could not locate the Dashboard section. No changes were made.');
  process.exit(1);
}

const beforeDashboard = text.slice(0, dashboardStart);
let dashboard = text.slice(dashboardStart, dashboardEnd);
const afterDashboard = text.slice(dashboardEnd);

const jobListStart = dashboard.indexOf('{group.items.map((job) => {');
const cardStart = jobListStart >= 0
  ? dashboard.indexOf('                <Card key={job.id} className="mb-3">', jobListStart)
  : -1;
const cardClose = cardStart >= 0
  ? dashboard.indexOf('                </Card>', cardStart)
  : -1;

if (jobListStart < 0 || cardStart < 0 || cardClose < 0) {
  console.error('Could not find the Home job card block. No changes were made.');
  process.exit(1);
}

const cardEnd = cardClose + '                </Card>'.length;

const newCardBlock = `                <Card key={job.id} className="mb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#000100] text-sm font-bold text-white">{job.company[0]}</div>
                      <h3 className="min-w-0 truncate text-2xl font-black leading-none tracking-tight text-[#000100]">{job.company}</h3>
                    </div>
                    {isApplied ? (
                      <span className="rounded-full bg-[#000100] px-3 py-1 text-xs font-bold text-white">Applied</span>
                    ) : (
                      <span className="rounded-full bg-[#a0fe08] px-3 py-1 text-xs font-bold text-[#000100]">{job.match}%</span>
                    )}
                  </div>

                  <p className="mt-3 text-sm font-medium leading-5 text-[#666666]">
                    {job.title} <span className="mx-1 text-[#999999]">·</span> {job.location}
                  </p>

                  {isApplied ? (
                    <>
                      <div className="mt-3 rounded-2xl border border-[#d1d3d2] bg-[#eaeceb] p-3 text-sm text-[#666666]">
                        <p><b className="text-[#000100]">Resume:</b> Job-tailored Resume v3</p>
                        <p><b className="text-[#000100]">Applied:</b> Today</p>
                        <p><b className="text-[#000100]">Status:</b> Under Review</p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StepPill>{job.type}</StepPill>
                        <StepPill>{job.salary}</StepPill>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-sm leading-6 text-[#666666]">{job.why}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StepPill>{job.type}</StepPill>
                        <StepPill>{job.salary}</StepPill>
                        <StepPill>Missing: {job.missing[0]}</StepPill>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <button onClick={() => go("detail", job)} className="rounded-xl bg-[#000100] py-2 text-xs font-bold text-white">Details</button>
                        <button onClick={() => onSaveJob(job.id)} className={\`rounded-xl border py-2 text-xs font-bold \${isSaved ? "border-[#a0fe08] bg-[#a0fe08] text-[#000100]" : "border-[#d1d3d2] bg-[#ffffff] text-[#000100]"}\`}>{isSaved ? "Saved ✓" : "Save"}</button>
                        <button onClick={() => go("tailor", job)} className="rounded-xl border border-[#d1d3d2] bg-[#ffffff] py-2 text-xs font-bold text-[#000100]">Apply</button>
                      </div>
                    </>
                  )}
                </Card>`;

dashboard = dashboard.slice(0, cardStart) + newCardBlock + dashboard.slice(cardEnd);

let updated = beforeDashboard + dashboard + afterDashboard;
if (usesCRLF) updated = updated.replace(/\n/g, '\r\n');
fs.writeFileSync(appPath, updated, 'utf8');

console.log('Done. Repaired the Home job card JSX and updated only the job card header layout.');
console.log('Company name is larger and aligned with the logo center.');
console.log('Job title + location are on a full-width line below: Job Title · Location.');
