// Display Files to be uploaded

 function renderFile(){
    const render = document.getElementById('file-display')
    const file = document.getElementById('file-upload').files[0]
    const reader = new FileReader()

    reader.addEventListener('load',()=>{
        render.src = reader.result;
    },false)

    if(file){
        reader.readAsDataURL(file)
    }
}

// Remove from featured Post
const remFilter = document.querySelectorAll('.removeFilter')

remFilter.forEach((post)=>{
    post.addEventListener('click',(e)=>{
        var target = e.target.getAttribute('data-title')
        if(confirm('Are you sure you want to Remove this post?')){
            fetch('/posts/featured/'+target+'/remove',{
                method:'POST'
            }).then(()=>{
                alert('Post Removed from featured Posts')
                window.location.reload()
                })
            
           }else{
            alert('Not Authorized')
           }
})
        
    })


    // Add featured post
 const addFeatured = document.querySelectorAll('.addFeatured')

 addFeatured.forEach((post)=>{
    post.addEventListener('click',(e)=>{
        var target = e.target.getAttribute('data-title')
        fetch('/posts/featured/'+target+'/add',{
            method:'POST'
        }).then(()=>{
            alert('Post added to Featured Posts')
            window.location.href='/admin/dashboard/featured-posts'
        })
    })
 })



 // remove user

 const remUser = document.querySelectorAll('.remUser')
 
 remUser.forEach((rem)=>{
    rem.addEventListener('click',(e)=>{
        var target = e.target.getAttribute('data-title')
        if(confirm('Are you sure you want to delete this user?')){
            fetch('/users/delete/'+target,{
                method:'DELETE'
            }).then(()=>{
                alert('deleted')
                window.location.reload()
            })
        }else{
            alert('cancelled')
        }
        
    })
 })

 // Initialize tags select

 document
 .querySelectorAll('.select')
 .forEach((el)=>new bootstrap5.Select(el))

 function ready(resolve) {
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve());
    } else {
      resolve();
    }
  }

//Tags in setting

  var tagTag = document.getElementById('tagTag')
  if(tagTag == null){

  }else{
    let tagTagVal = tagTag.getAttribute('value')

  let santagTag = tagTagVal.replace(/[\[\"\]]/g,'').split(',')

  var instance2 = new TagsInput({
     selector:'tagTag'

  })

  instance2.addData(santagTag)
  }
  

 // category in setting

     var catTag = document.getElementById('categoryTag')
    if(catTag == null){
        
    }else{
        let catTagVal = catTag.getAttribute('value')

     let sanTag = catTagVal.replace(/[\[\"\]]/g,'').split(',')

     var instance = new TagsInput({
        selector:'categoryTag'
     })

     instance.addData(sanTag)
    }
     

    