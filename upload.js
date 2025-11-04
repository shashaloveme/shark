const fileInput = document.getElementById('fileInput');
const msgBox     = document.getElementById('msg');

fileInput.addEventListener('change', async ()=>{
  const file = fileInput.files[0];
  if(!file) return;

  msgBox.textContent = '正在上传，请稍候...';

  // 把文件转成 base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {

    // 调用 GitHub API：把文件直接塞进仓库
    const token = prompt('请输入你的 GitHub 令牌（只存本地，用完可删）');
    if(!token){ msgBox.textContent='需要令牌才能继续'; return; }

    const path   = `uploads/${Date.now()}-${file.name}`;
    const body   = {
      message:`上传 ${file.name}`,
      content: reader.result.split(',')[1]  // 去掉 data:base64, 头
    };

    const repo = 'shashaloveme/linshi-wangpan';   // ⚠️改成你自己的
    const url  = `https://api.github.com/repos/${repo}/contents/${path}`;

    const res = await fetch(url,{
      method:'PUT',
      headers:{
        'Authorization':`token ${token}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify(body)
    });

    if(res.ok){
      const {content} = await res.json();
      msgBox.innerHTML = `✅ 上传成功！<br>
        <a href="${content.download_url}" target="_blank">点我下载 ${file.name}</a>`;
    }else{
      msgBox.textContent = '上传失败：' + (await res.json()).message;
    }
  };
});
