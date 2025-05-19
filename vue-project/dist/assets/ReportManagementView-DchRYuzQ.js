import{d as H,r as i,e as A,f as I,g as P,c as p,a as t,h as x,w as b,v as k,i as j,j as C,F as O,b as W,t as d,o as u,_ as G}from"./index-Cm9KO5RD.js";import{r as h,B as Y}from"./ReportService-83mYHGM3.js";const K={class:"reports-page"},Q={class:"reports-container"},q={class:"reports-header"},J={class:"search-filters"},X={class:"search-bar"},Z={class:"filter-group"},ee={class:"upload-section"},te=["disabled"],se={class:"reports-grid"},ae={class:"report-icon"},oe={class:"report-info"},le={class:"report-meta"},ne={class:"type-badge"},ie={class:"status-badge"},de={class:"report-details"},re={class:"report-actions"},ce=["onClick","disabled"],pe=["onClick"],ue=["onClick"],me={key:0,class:"modal"},ve={class:"modal-content"},he={class:"modal-body"},fe=H({__name:"ReportManagementView",setup(ge){const f=i([]),r=i(!1),n=i(""),m=i(""),w=i(""),g=i(!1),v=i(""),R=()=>{console.log("搜索:",n.value)},M=()=>{n.value="",console.log("已清空搜索")},c=async()=>{try{const s=await h.getReports();console.log("获取到的文件列表:",s.data),f.value=s.data.map(e=>({id:e.id,filename:e.filename,name:e.name,type:e.name.toLowerCase().endsWith(".pdf")?"PDF":"HTML",status:"已上传",createTime:new Date(e.uploadTime).toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),size:U(e.size),downloadUrl:`${Y}/uploads/${e.filename}`})),console.log("处理后的报告列表:",f.value)}catch(s){console.error("获取报告列表失败:",s)}},S=A(()=>{let s=f.value.filter(e=>n.value.trim()===""?!0:e.name.toLowerCase().includes(n.value.toLowerCase()));return m.value&&(s=s.filter(e=>e.type===m.value)),w.value&&(s=s.filter(e=>e.status===w.value)),s}),U=s=>{if(s===0)return"0 B";const e=1024,a=["B","KB","MB","GB"],l=Math.floor(Math.log(s)/Math.log(e));return parseFloat((s/Math.pow(e,l)).toFixed(2))+" "+a[l]},L=async s=>{var l;const e=s.target;if(!((l=e.files)!=null&&l.length))return;const a=e.files[0];r.value=!0;try{console.log("准备上传文件:",{name:a.name,size:a.size,type:a.type});const o=await h.uploadReport(a);console.log("上传响应:",o.data),e.value="",await c()}catch(o){console.error("上传失败:",o),alert("上传失败: "+(o instanceof Error?o.message:"未知错误"))}finally{r.value=!1}},F=()=>{v.value="",g.value=!0},y=()=>{g.value=!1},T=async()=>{let s=v.value.trim();if(!s){alert("请输入报告名称");return}s.toLowerCase().endsWith(".html")||(s+=".html"),await $(s),y()},$=async s=>{const e=new Date,a=_=>_.toString().padStart(2,"0"),o=`<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>自动化测试报告</title>
    <style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;margin:0;padding:20px;background:#f5f5f5;}.container{max-width:1200px;margin:0 auto;background:white;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);}.header{text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #eee;}.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:30px;}.stat-card{background:#f8f9fa;padding:15px;border-radius:6px;text-align:center;}.stat-value{font-size:24px;font-weight:bold;color:#006AF1;}.stat-label{color:#666;font-size:14px;}.test-cases{border:1px solid #eee;border-radius:6px;}.test-case{padding:15px;border-bottom:1px solid #eee;}.test-case:last-child{border-bottom:none;}.success{color:#48bb78;}.failed{color:#f56565;}.timestamp{color:#718096;font-size:14px;}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>自动化测试报告</h1>
            <p class="timestamp">生成时间：${`${e.getFullYear()}-${a(e.getMonth()+1)}-${a(e.getDate())} ${a(e.getHours())}:${a(e.getMinutes())}:${a(e.getSeconds())}`}</p>
        </div>
        <div class="summary">
            <div class="stat-card">
                <div class="stat-value">42</div>
                <div class="stat-label">测试用例总数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">38</div>
                <div class="stat-label">通过数量</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">4</div>
                <div class="stat-label">失败数量</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">90.5%</div>
                <div class="stat-label">通过率</div>
            </div>
        </div>
        <h2>测试用例详情</h2>
        <div class="test-cases">
            <div class="test-case">
                <h3>感知模块测试 <span class="success">✓ 通过</span></h3>
                <p>测试目标：验证感知模块对障碍物的识别准确性</p>
                <p>执行时间：180ms</p>
                <p>测试结果：识别准确率 98.5%</p>
            </div>
            <div class="test-case">
                <h3>决策系统测试 <span class="failed">✗ 失败</span></h3>
                <p>测试目标：验证决策系统在复杂场景下的响应时间</p>
                <p>执行时间：250ms</p>
                <p>失败原因：响应时间超过预期阈值（预期：200ms，实际：250ms）</p>
            </div>
            <div class="test-case">
                <h3>控制模块测试 <span class="success">✓ 通过</span></h3>
                <p>测试目标：验证控制指令的执行精度</p>
                <p>执行时间：150ms</p>
                <p>测试结果：控制精度误差 ±0.02m</p>
            </div>
        </div>
    </div>
</body>
</html>`,E=new Blob([o],{type:"text/html"}),V=new File([E],s,{type:"text/html"});r.value=!0;try{await h.uploadReport(V),await c(),alert("测试报告已生成并上传！")}catch{alert("生成或上传失败")}finally{r.value=!1}},z=async s=>{try{console.log("开始下载文件:",s.filename);const e=await fetch(s.downloadUrl);if(!e.ok)throw new Error(`下载失败: ${e.status} ${e.statusText}`);const a=await e.blob(),l=window.URL.createObjectURL(a),o=document.createElement("a");o.href=l,o.download=s.name,document.body.appendChild(o),o.click(),window.URL.revokeObjectURL(l),document.body.removeChild(o),console.log("文件下载完成")}catch(e){console.error("下载文件时出错:",e),alert("下载文件失败，请重试")}},B=async s=>{if(confirm("确定要删除这个报告吗？"))try{if(console.log("准备删除文件:",s),!s.filename)throw new Error("文件名不能为空");await h.deleteReport(s.filename),console.log("文件删除成功"),await c()}catch(e){console.error("删除失败:",e),alert("删除失败: "+(e instanceof Error?e.message:"未知错误"))}},D=()=>{setInterval(()=>{c()},5e3)},N=s=>{window.location.href=s.downloadUrl};return I(()=>{c(),D()}),P(()=>{}),(s,e)=>(u(),p("div",K,[e[7]||(e[7]=t("div",{class:"page-header"},[t("h1",null,"报告管理模块"),t("p",null,"查看和下载测试报告")],-1)),t("div",Q,[t("div",q,[t("div",J,[t("div",X,[b(t("input",{type:"text","onUpdate:modelValue":e[0]||(e[0]=a=>n.value=a),placeholder:"搜索报告...",onInput:R},null,544),[[k,n.value]]),n.value?(u(),p("button",{key:0,class:"clear-search",onClick:M}," ✕ ")):x("",!0)]),t("div",Z,[b(t("select",{"onUpdate:modelValue":e[1]||(e[1]=a=>m.value=a)},e[3]||(e[3]=[t("option",{value:""},"所有类型",-1),t("option",{value:"HTML"},"HTML",-1),t("option",{value:"PDF"},"PDF",-1)]),512),[[j,m.value]])])])]),t("div",ee,[t("input",{type:"file",id:"file-upload",class:"file-input",onChange:L,accept:".html,.pdf"},null,32),e[5]||(e[5]=t("label",{for:"file-upload",class:"upload-btn"},[t("i",{class:"upload-icon"},"📤"),C(" 上传报告 ")],-1)),t("button",{class:"upload-btn",style:{"margin-left":"16px",background:"#67c23a"},onClick:F,disabled:r.value},e[4]||(e[4]=[t("i",{class:"upload-icon"},"📝",-1),C(" 一键生成测试报告 ")]),8,te)]),t("div",se,[(u(!0),p(O,null,W(S.value,a=>(u(),p("div",{key:a.id,class:"report-card"},[t("div",ae,d(a.type==="HTML"?"📄":"📑"),1),t("div",oe,[t("h3",null,d(a.name),1),t("div",le,[t("span",ne,d(a.type),1),t("span",ie,d(a.status),1)]),t("div",de,[t("span",null,d(a.createTime),1),t("span",null,d(a.size),1)])]),t("div",re,[t("button",{class:"action-btn download",onClick:l=>z(a),disabled:a.status==="生成中"}," 下载 ",8,ce),t("button",{class:"action-btn delete",onClick:l=>B(a)}," 删除 ",8,pe),t("button",{class:"action-btn view",onClick:l=>N(a)}," 查看报告 ",8,ue)])]))),128))])]),g.value?(u(),p("div",me,[t("div",ve,[e[6]||(e[6]=t("div",{class:"modal-header"},[t("span",null,"请输入报告文件名")],-1)),t("div",he,[b(t("input",{"onUpdate:modelValue":e[2]||(e[2]=a=>v.value=a),placeholder:"如 test-report.html",style:{width:"100%",padding:"8px","font-size":"16px"}},null,512),[[k,v.value]])]),t("div",{class:"modal-footer"},[t("button",{class:"btn",onClick:y},"取消"),t("button",{class:"btn btn-primary",onClick:T},"生成")])])])):x("",!0)]))}}),ye=G(fe,[["__scopeId","data-v-85ef6b64"]]);export{ye as default};
