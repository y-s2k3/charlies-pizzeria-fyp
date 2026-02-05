// ============================================
// LOGIN PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const user = loginUser(email, password);
            
            if (user) {
                // Success animation
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                submitBtn.style.background = 'linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)';
                
                setTimeout(() => {
                    // Redirect based on user type
                    if (user.type === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'menu.html';
                    }
                }, 1000);
            } else {
                // Error feedback
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Invalid Credentials';
                submitBtn.style.background = 'linear-gradient(135deg, #FF4757 0%, #FF6B6B 100%)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #FFA726 100%)';
                }, 2000);
                
                // Show demo credentials
                alert('Demo Credentials:\n\nCustomer: customer@test.com / 123\nAdmin: admin@test.com / admin123');
            }
        });
    }
});