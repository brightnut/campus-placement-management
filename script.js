const students=[{id:1,name:"Aarav Mehta",email:"student@campus.edu",department:"Computer Science",year:2026,cgpa:8.6,backlogs:0,skills:["Python","Java","DSA","SQL","React"],projects:3}];
let jobs=[
{id:1,company:"Northstar Labs",role:"Software Engineer",type:"Full-time",location:"Bengaluru - Hybrid",pkg:"18-24 LPA",minCGPA:7.5,maxBacklogs:0,skills:["Java","DSA","SQL"],deadline:"2026-10-22"},
{id:2,company:"Vertex AI",role:"Applied AI Intern",type:"Internship",location:"Remote - India",pkg:"65k/month",minCGPA:8,maxBacklogs:0,skills:["Python","Machine Learning","SQL"],deadline:"2026-10-18"},
{id:3,company:"Finora",role:"Backend Developer",type:"Full-time",location:"Mumbai - On-site",pkg:"14-19 LPA",minCGPA:7,maxBacklogs:0,skills:["Java","Spring Boot","DSA"],deadline:"2026-10-28"}];
let applications=[{id:1,studentId:1,jobId:1,status:"Shortlisted",date:"Oct 05, 2026"}];
let role="student",page="dashboard",filter="All";
const student=students[0];
const $=id=>document.getElementById(id);
function eligible(job){return student.cgpa>=job.minCGPA&&student.backlogs<=job.maxBacklogs&&job.skills.every(s=>student.skills.some(x=>x.toLowerCase()===s.toLowerCase()));}
function jobById(id){return jobs.find(j=>j.id===id)}
function showPage(p){
 page=p;document.querySelectorAll(".page").forEach(x=>x.classList.remove("active-page"));
 const el=$(p);if(el)el.classList.add("active-page");
 document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===p));
 const titles={dashboard:"Student Dashboard",jobs:"Job Listings",applications:"My Applications",profile:"My Profile",recruiterDashboard:"Recruiter Dashboard",recruiterJobs:"My Job Postings",allApplications:"Applications"};
 $("pageTitle").textContent=titles[p]||"Campus Placement Portal";window.scrollTo(0,0);
 render();
}
function render(){
 if(role==="student"){const apps=applications.filter(a=>a.studentId===1);$("eligibleCount").textContent=jobs.filter(eligible).length;$("applicationCount").textContent=apps.length;$("shortlistedCount").textContent=apps.filter(a=>a.status==="Shortlisted").length;renderRecommended();renderTimeline();renderJobs();renderApps();renderProfile()}
 else {renderRecruiterStats();renderRecruiterJobs();renderAllApps();renderRecentApps()}
}
function renderRecommended(){
 $("recommendedJobs").innerHTML=jobs.filter(eligible).slice(0,3).map(j=>`<div class="job-mini"><div class="job-mini-main"><div class="company-logo">${j.company[0]}</div><div><strong>${j.role}</strong><small>${j.company} • ${j.location}</small></div></div><span class="pill eligible">Eligible</span></div>`).join("")||'<p style="color:#899;font-size:.75rem">No matching jobs.</p>';
}
function renderTimeline(){
 const apps=applications.filter(a=>a.studentId===1);
 $("timeline").innerHTML=apps.map(a=>{const j=jobById(a.jobId);return `<div class="timeline-item"><span class="timeline-dot"></span><div><strong>${j.role} at ${j.company}</strong><small>${a.status} • ${a.date}</small></div></div>`}).join("")||'<p style="color:#899;font-size:.75rem">No recent activity.</p>';
}
function renderJobs(){
 const q=($("jobSearch")?.value||"").toLowerCase();
 const filtered=jobs.filter(j=>(filter==="All"||j.type===filter||(filter==="Remote"&&j.location.toLowerCase().includes("remote")))&&(j.company+j.role+j.skills.join(" ")).toLowerCase().includes(q));
 $("jobsGrid").innerHTML=filtered.map(j=>{
 const isApplied=applications.some(a=>a.studentId===1&&a.jobId===j.id);
 return `<article class="job-card"><div class="job-top"><div class="job-company"><div class="company-logo">${j.company[0]}</div><div><div class="job-company">${j.company}</div><div class="location">📍 ${j.location}</div></div></div><span class="pill ${eligible(j)?"eligible":"not-eligible"}">${eligible(j)?"Eligible":"Not eligible"}</span></div><h3>${j.role}</h3><div class="job-details"><div><span>Type</span><strong>${j.type}</strong></div><div><span>Package</span><strong>${j.pkg}</strong></div><div><span>Min CGPA</span><strong>${j.minCGPA}</strong></div><div><span>Deadline</span><strong>${j.deadline}</strong></div></div><div class="skills">${j.skills.map(s=>`<span class="skill">${s}</span>`).join("")}</div><div class="job-actions"><small>${j.maxBacklogs} max backlog${j.maxBacklogs!==1?"s":""}</small><button class="btn ${isApplied?"outline":"primary"}" ${(!eligible(j)||isApplied)?"disabled":""} onclick="apply(${j.id})">${isApplied?"Applied ✓":eligible(j)?"Apply Now":"Not Eligible"}</button></div></article>`}).join("")||'<div class="card" style="grid-column:1/-1;text-align:center">No jobs found.</div>';
}
function renderApps(){
 const rows=applications.filter(a=>a.studentId===1).map(a=>{const j=jobById(a.jobId);return `<tr><td><strong>${j.company}</strong></td><td>${j.role}</td><td>${j.type}</td><td>${a.date}</td><td><span class="pill ${a.status==="Rejected"?"not-eligible":"eligible"}">${a.status}</span></td></tr>`}).join("");
 $("applicationsTable").innerHTML=rows||'<tr><td colspan="5">No applications yet.</td></tr>';
}
function renderProfile(){}
function apply(id){
 const j=jobById(id);if(!eligible(j))return;
 if(!applications.some(a=>a.jobId===id&&a.studentId===1)){applications.push({id:applications.length+1,studentId:1,jobId:id,status:"Applied",date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})});toast("Application submitted successfully!");render();}
}
function renderRecruiterStats(){
 $("rJobCount").textContent=jobs.length;$("rAppCount").textContent=applications.length;$("rShortCount").textContent=applications.filter(a=>a.status==="Shortlisted").length;
}
function renderRecruiterJobs(){
 $("recruiterJobsGrid").innerHTML=jobs.map(j=>`<article class="job-card"><div class="job-top"><div class="job-company"><div class="company-logo">${j.company[0]}</div><div><div class="job-company">${j.company}</div><div class="location">📍 ${j.location}</div></div></div><span class="pill eligible">${j.type}</span></div><h3>${j.role}</h3><div class="job-details"><div><span>Package</span><strong>${j.pkg}</strong></div><div><span>Min CGPA</span><strong>${j.minCGPA}</strong></div><div><span>Deadline</span><strong>${j.deadline}</strong></div><div><span>Applications</span><strong>${applications.filter(a=>a.jobId===j.id).length}</strong></div></div><div class="skills">${j.skills.map(s=>`<span class="skill">${s}</span>`).join("")}</div></article>`).join("");
}
function renderAllApps(){
 $("allAppsTable").innerHTML=applications.map(a=>{const j=jobById(a.jobId);const s=students.find(x=>x.id===a.studentId)||student;return `<tr><td><strong>${s.name}</strong><br><small>${s.department}</small></td><td>${j.company}</td><td>${j.role}</td><td><span class="pill eligible">${a.status}</span></td><td><select onchange="updateStatus(${a.id},this.value)"><option ${a.status==="Applied"?"selected":""}>Applied</option><option ${a.status==="In review"?"selected":""}>In review</option><option ${a.status==="Shortlisted"?"selected":""}>Shortlisted</option><option ${a.status==="Interview"?"selected":""}>Interview</option><option ${a.status==="Rejected"?"selected":""}>Rejected</option><option ${a.status==="Placed"?"selected":""}>Placed</option></select></td></tr>`}).join("");
}
function renderRecentApps(){
 $("recentRecruiterApps").innerHTML=applications.slice(-4).reverse().map(a=>{const j=jobById(a.jobId);return `<div class="job-mini"><div class="job-mini-main"><div class="company-logo">${student.name[0]}</div><div><strong>${student.name}</strong><small>${j.role} • ${j.company}</small></div></div><span class="pill eligible">${a.status}</span></div>`}).join("");
}
function updateStatus(id,status){const a=applications.find(x=>x.id===id);if(a){a.status=status;toast("Application status updated");render()}}
function openJobModal(){$("jobModal").classList.remove("hidden")}
function closeJobModal(){$("jobModal").classList.add("hidden")}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
document.querySelectorAll(".role").forEach(btn=>btn.onclick=()=>{
 role=btn.dataset.role;document.querySelectorAll(".role").forEach(x=>x.classList.toggle("active",x===btn));
 $("studentNav").classList.toggle("hidden",role!=="student");$("recruiterNav").classList.toggle("hidden",role==="student");
 $("userName").textContent=role==="student"?"Aarav Mehta":"Rhea Kapoor";$("userRole").textContent=role==="student"?"Student • Computer Science":"Recruiter • Northstar Labs";$("avatar").textContent=role==="student"?"AM":"RK";
 showPage(role==="student"?"dashboard":"recruiterDashboard");
});
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showPage(n.dataset.page));
$("jobSearch").addEventListener("input",renderJobs);
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.type;renderJobs()});
$("jobForm").onsubmit=e=>{e.preventDefault();jobs.push({id:jobs.length+1,company:$("company").value,role:$("role").value,type:$("type").value,location:$("location").value,pkg:$("package").value,minCGPA:+$("minCgpa").value,maxBacklogs:+$("maxBacklogs").value,skills:$("skills").value.split(",").map(x=>x.trim()).filter(Boolean),deadline:$("deadline").value});e.target.reset();closeJobModal();toast("Job posted successfully!");render()};
$("logout").onclick=()=>toast("Demo logout — authentication can be connected to a backend.");
$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");
render();
