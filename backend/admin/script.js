// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.loadCategories();
        this.loadBrands();
        this.loadProducts();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.showSection(section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('show');
        });

        // Product form
        document.getElementById('saveProduct').addEventListener('click', () => {
            this.saveProduct();
        });

        // Brand form
        document.getElementById('saveBrand').addEventListener('click', () => {
            this.saveBrand();
        });

        // Logo preview
        document.getElementById('brandLogo').addEventListener('change', (e) => {
            this.previewLogo(e.target.files[0]);
        });

        // Image preview
        document.getElementById('productImage').addEventListener('change', (e) => {
            this.previewImage(e.target.files[0]);
        });

        // Search functionality
        document.getElementById('productSearch').addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

        // Order status filter
        document.getElementById('orderStatusFilter').addEventListener('change', (e) => {
            this.filterOrders(e.target.value);
        });

        // Order search
        document.getElementById('orderSearch').addEventListener('input', (e) => {
            this.searchOrders(e.target.value);
        });
    }

    showSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Tableau de bord',
            products: 'Gestion des Produits',
            categories: 'Gestion des Catégories',
            brands: 'Gestion des Marques',
            orders: 'Gestion des Commandes',
            settings: 'Paramètres'
        };
        document.getElementById('pageTitle').textContent = titles[section];

        this.currentSection = section;

        // Load section data
        switch(section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'brands':
                this.loadBrands();
                break;
            case 'orders':
                this.loadOrders();
                break;
        }
    }

    async loadDashboard() {
        try {
            // Load statistics
            const [products, categories] = await Promise.all([
                this.fetchData('/products'),
                this.fetchData('/products/categories')
            ]);

            document.getElementById('totalProducts').textContent = products.products?.length || 0;
            document.getElementById('totalCategories').textContent = categories.categories?.length || 0;
            document.getElementById('totalOrders').textContent = '0';
            document.getElementById('totalRevenue').textContent = '0';

            // Load recent activity
            this.loadRecentActivity();
            
            // Load sales chart
            this.loadSalesChart();
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        }
    }

    loadRecentActivity() {
        const activities = [
            { icon: 'fas fa-plus', text: 'Nouveau produit ajouté', time: 'Il y a 2 heures' },
            { icon: 'fas fa-shopping-cart', text: 'Nouvelle commande reçue', time: 'Il y a 4 heures' },
            { icon: 'fas fa-user', text: 'Nouvel utilisateur inscrit', time: 'Il y a 6 heures' },
            { icon: 'fas fa-edit', text: 'Produit modifié', time: 'Il y a 1 jour' }
        ];

        const activityHtml = activities.map(activity => `
            <div class="d-flex align-items-center mb-3">
                <div class="flex-shrink-0">
                    <div class="bg-light rounded-circle p-2">
                        <i class="${activity.icon} text-primary"></i>
                    </div>
                </div>
                <div class="flex-grow-1 ms-3">
                    <p class="mb-0 fw-medium">${activity.text}</p>
                    <small class="text-muted">${activity.time}</small>
                </div>
            </div>
        `).join('');

        document.getElementById('recentActivity').innerHTML = activityHtml;
    }

    loadSalesChart() {
        const ctx = document.getElementById('salesChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Ventes (MAD)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    async loadProducts() {
        try {
            this.showLoading();
            const response = await this.fetchData('/products');
            const products = response.products || [];
            
            const tableBody = document.getElementById('productsTable');
            tableBody.innerHTML = '';

            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img src="${product.image_url || 'https://via.placeholder.com/50'}" 
                             alt="${product.nom}" class="product-image">
                    </td>
                    <td>
                        <div class="fw-medium">${product.nom}</div>
                        <small class="text-muted">#${product.id}</small>
                    </td>
                    <td>${product.category_name || 'Non définie'}</td>
                    <td class="fw-medium">${parseFloat(product.prix).toFixed(2)} MAD</td>
                    <td>
                        <span class="badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                            ${product.stock}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge ${product.stock > 0 ? 'active' : 'inactive'}">
                            ${product.stock > 0 ? 'Actif' : 'Rupture'}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary btn-action" 
                                    onclick="adminPanel.editProduct(${product.id})" title="Modifier">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-action" 
                                    onclick="adminPanel.deleteProduct(${product.id})" title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            this.hideLoading();
        } catch (error) {
            console.error('Erreur chargement produits:', error);
            this.showToast('Erreur', 'Impossible de charger les produits', 'error');
            this.hideLoading();
        }
    }

    async loadCategories() {
        try {
            const response = await this.fetchData('/products/categories');
            const categories = response.categories || [];
            
            // Update categories table
            const tableBody = document.getElementById('categoriesTable');
            tableBody.innerHTML = '';

            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="fw-medium">#${category.id}</td>
                    <td>${category.nom}</td>
                    <td>${category.description || 'Aucune description'}</td>
                    <td>
                        <span class="badge bg-primary">${category.product_count || 0}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary btn-action" 
                                    onclick="adminPanel.editCategory(${category.id})" title="Modifier">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-action" 
                                    onclick="adminPanel.deleteCategory(${category.id})" title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Update product category select
            const categorySelect = document.getElementById('productCategory');
            categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.nom;
                categorySelect.appendChild(option);
            });

        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            this.showToast('Erreur', 'Impossible de charger les catégories', 'error');
        }
    }

    async loadBrands() {
        try {
            const response = await this.fetchData('/products/brands');
            const brands = response.brands || [];
            
            // Update brands table
            const tableBody = document.getElementById('brandsTable');
            tableBody.innerHTML = '';

            brands.forEach(brand => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img src="${brand.logo_url || 'https://via.placeholder.com/40x40?text=Logo'}" 
                             alt="${brand.nom}" class="brand-logo" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;">
                    </td>
                    <td class="fw-medium">${brand.nom}</td>
                    <td>${brand.description || 'Aucune description'}</td>
                    <td>
                        ${brand.website ? `<a href="${brand.website}" target="_blank" class="text-decoration-none"><i class="fas fa-external-link-alt"></i> Site</a>` : 'Non renseigné'}
                    </td>
                    <td>
                        <span class="badge bg-primary">${brand.product_count || 0}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary btn-action" 
                                    onclick="adminPanel.editBrand(${brand.id})" title="Modifier">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-action" 
                                    onclick="adminPanel.deleteBrand(${brand.id})" title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Update product brand select
            const brandSelect = document.getElementById('productBrand');
            brandSelect.innerHTML = '<option value="">Sélectionner une marque (optionnel)</option>';
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.id;
                option.textContent = brand.nom;
                brandSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Erreur chargement marques:', error);
            this.showToast('Erreur', 'Impossible de charger les marques', 'error');
        }
    }

    async saveProduct() {
        try {
            const form = document.getElementById('productForm');
            const formData = new FormData(form);
            
            // Ajouter explicitement les valeurs des checkboxes
            formData.set('is_bestseller', document.getElementById('isBestseller').checked ? 'true' : 'false');
            formData.set('is_new', document.getElementById('isNew').checked ? 'true' : 'false');
            formData.set('is_featured', document.getElementById('isFeatured').checked ? 'true' : 'false');
            
            console.log('📦 Données envoyées:');
            console.log('- Bestseller:', formData.get('is_bestseller'));
            console.log('- Nouveauté:', formData.get('is_new'));
            console.log('- En vedette:', formData.get('is_featured'));
            
            // Validation
            if (!formData.get('nom') || !formData.get('prix') || !formData.get('category_id')) {
                this.showToast('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }

            // Vérifier si une image est sélectionnée pour un nouveau produit
            const productId = formData.get('id');
            const imageFile = formData.get('image');
            
            if (!productId && (!imageFile || imageFile.size === 0)) {
                this.showToast('Erreur', 'Veuillez sélectionner une image pour le produit', 'error');
                return;
            }

            this.showLoading();

            const url = productId ? `/products/${productId}` : '/products';
            const method = productId ? 'PUT' : 'POST';

            const response = await fetch(`${this.apiUrl}${url}`, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                this.showToast('Succès', productId ? 'Produit modifié avec succès' : 'Produit ajouté avec succès', 'success');
                bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
                this.loadProducts();
                form.reset();
                document.getElementById('imagePreview').style.display = 'none';
            } else {
                this.showToast('Erreur', result.message || 'Erreur lors de la sauvegarde', 'error');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Erreur sauvegarde produit:', error);
            this.showToast('Erreur', 'Erreur lors de la sauvegarde du produit: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    async saveCategory() {
        try {
            const form = document.getElementById('categoryForm');
            const formData = new FormData(form);
            
            if (!formData.get('nom')) {
                this.showToast('Erreur', 'Le nom de la catégorie est obligatoire', 'error');
                return;
            }

            this.showLoading();

            const categoryId = formData.get('id');
            const url = categoryId ? `/products/categories/${categoryId}` : '/products/categories';
            const method = categoryId ? 'PUT' : 'POST';

            const response = await fetch(`${this.apiUrl}${url}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nom: formData.get('nom'),
                    description: formData.get('description')
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Succès', categoryId ? 'Catégorie modifiée avec succès' : 'Catégorie ajoutée avec succès', 'success');
                bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
                this.loadCategories();
                form.reset();
            } else {
                this.showToast('Erreur', result.message || 'Erreur lors de la sauvegarde', 'error');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Erreur sauvegarde catégorie:', error);
            this.showToast('Erreur', 'Erreur lors de la sauvegarde de la catégorie', 'error');
            this.hideLoading();
        }
    }

    async saveBrand() {
        try {
            const form = document.getElementById('brandForm');
            const formData = new FormData(form);
            
            if (!formData.get('nom')) {
                this.showToast('Erreur', 'Le nom de la marque est obligatoire', 'error');
                return;
            }

            this.showLoading();

            const brandId = formData.get('id');
            const url = brandId ? `/products/brands/${brandId}` : '/products/brands';
            const method = brandId ? 'PUT' : 'POST';

            const response = await fetch(`${this.apiUrl}${url}`, {
                method: method,
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Succès', brandId ? 'Marque modifiée avec succès' : 'Marque ajoutée avec succès', 'success');
                bootstrap.Modal.getInstance(document.getElementById('brandModal')).hide();
                this.loadBrands();
                form.reset();
                document.getElementById('logoPreview').style.display = 'none';
            } else {
                this.showToast('Erreur', result.message || 'Erreur lors de la sauvegarde', 'error');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Erreur sauvegarde marque:', error);
            this.showToast('Erreur', 'Erreur lors de la sauvegarde de la marque', 'error');
            this.hideLoading();
        }
    }

    async editBrand(id) {
        try {
            const response = await this.fetchData(`/products/brands/${id}`);
            const brand = response.brand;

            if (brand) {
                document.getElementById('brandId').value = brand.id;
                document.getElementById('brandName').value = brand.nom;
                document.getElementById('brandDescription').value = brand.description || '';
                document.getElementById('brandWebsite').value = brand.website || '';
                
                if (brand.logo_url) {
                    document.getElementById('logoPreview').style.display = 'block';
                    document.getElementById('previewLogo').src = brand.logo_url;
                }

                document.getElementById('brandModalTitle').textContent = 'Modifier la marque';
                new bootstrap.Modal(document.getElementById('brandModal')).show();
            }
        } catch (error) {
            console.error('Erreur chargement marque:', error);
            this.showToast('Erreur', 'Impossible de charger la marque', 'error');
        }
    }

    async deleteBrand(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
            try {
                this.showLoading();
                const response = await fetch(`${this.apiUrl}/products/brands/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.showToast('Succès', 'Marque supprimée avec succès', 'success');
                    this.loadBrands();
                } else {
                    this.showToast('Erreur', result.message || 'Erreur lors de la suppression', 'error');
                }

                this.hideLoading();
            } catch (error) {
                console.error('Erreur suppression marque:', error);
                this.showToast('Erreur', 'Erreur lors de la suppression de la marque', 'error');
                this.hideLoading();
            }
        }
    }

    previewLogo(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('logoPreview').style.display = 'block';
                document.getElementById('previewLogo').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    async editProduct(id) {
        try {
            const response = await this.fetchData(`/products/${id}`);
            const product = response.product;

            if (product) {
                document.getElementById('productId').value = product.id;
                document.getElementById('productName').value = product.nom;
                document.getElementById('productCategory').value = product.category_id;
                document.getElementById('productBrand').value = product.brand_id || '';
                document.getElementById('productPrice').value = product.prix;
                document.getElementById('productStock').value = product.stock;
                document.getElementById('productDescription').value = product.description || '';
                
                // Gérer les checkboxes pour les sections spéciales
                document.getElementById('isBestseller').checked = product.is_bestseller == 1;
                document.getElementById('isNew').checked = product.is_new == 1;
                document.getElementById('isFeatured').checked = product.is_featured == 1;
                
                if (product.image_url) {
                    document.getElementById('imagePreview').style.display = 'block';
                    document.getElementById('previewImg').src = product.image_url;
                }

                document.getElementById('productModalTitle').textContent = 'Modifier le produit';
                new bootstrap.Modal(document.getElementById('productModal')).show();
            }
        } catch (error) {
            console.error('Erreur chargement produit:', error);
            this.showToast('Erreur', 'Impossible de charger le produit', 'error');
        }
    }

    async editCategory(id) {
        try {
            const response = await this.fetchData(`/products/categories/${id}`);
            const category = response.category;

            if (category) {
                document.getElementById('categoryId').value = category.id;
                document.getElementById('categoryName').value = category.nom;
                document.getElementById('categoryDescription').value = category.description || '';

                document.getElementById('categoryModalTitle').textContent = 'Modifier la catégorie';
                new bootstrap.Modal(document.getElementById('categoryModal')).show();
            }
        } catch (error) {
            console.error('Erreur chargement catégorie:', error);
            this.showToast('Erreur', 'Impossible de charger la catégorie', 'error');
        }
    }

    async deleteProduct(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                this.showLoading();
                const response = await fetch(`${this.apiUrl}/products/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.showToast('Succès', 'Produit supprimé avec succès', 'success');
                    this.loadProducts();
                } else {
                    this.showToast('Erreur', result.message || 'Erreur lors de la suppression', 'error');
                }

                this.hideLoading();
            } catch (error) {
                console.error('Erreur suppression produit:', error);
                this.showToast('Erreur', 'Erreur lors de la suppression du produit', 'error');
                this.hideLoading();
            }
        }
    }

    async deleteCategory(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            try {
                this.showLoading();
                const response = await fetch(`${this.apiUrl}/products/categories/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.showToast('Succès', 'Catégorie supprimée avec succès', 'success');
                    this.loadCategories();
                } else {
                    this.showToast('Erreur', result.message || 'Erreur lors de la suppression', 'error');
                }

                this.hideLoading();
            } catch (error) {
                console.error('Erreur suppression catégorie:', error);
                this.showToast('Erreur', 'Erreur lors de la suppression de la catégorie', 'error');
                this.hideLoading();
            }
        }
    }

    previewImage(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('imagePreview').style.display = 'block';
                document.getElementById('previewImg').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    searchProducts(query) {
        const rows = document.querySelectorAll('#productsTable tr');
        rows.forEach(row => {
            const productName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase();
            if (productName && productName.includes(query.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    async loadOrders() {
        try {
            this.showLoading();
            
            // Charger les vraies commandes depuis l'API
            const response = await this.fetchData('/orders/admin/all');
            const orders = response.orders || [];
            
            // Mettre à jour les statistiques
            const stats = this.calculateOrderStats(orders);
            document.getElementById('pendingOrders').textContent = stats.pending;
            document.getElementById('confirmedOrders').textContent = stats.confirmed;
            document.getElementById('shippedOrders').textContent = stats.shipped;
            document.getElementById('deliveredOrders').textContent = stats.delivered;
            
            // Remplir le tableau
            const tableBody = document.getElementById('ordersTable');
            tableBody.innerHTML = '';

            if (orders.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" class="text-center text-muted py-4">
                        <i class="fas fa-shopping-cart fa-2x mb-2"></i><br>
                        Aucune commande trouvée
                    </td>
                `;
                tableBody.appendChild(row);
            } else {
                orders.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <div class="fw-medium">#${order.id}</div>
                        </td>
                        <td>
                            <div class="fw-medium">${order.user_name}</div>
                            <small class="text-muted">${order.user_email}</small>
                        </td>
                        <td>
                            <div>${new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
                            <small class="text-muted">${new Date(order.created_at).toLocaleTimeString('fr-FR')}</small>
                        </td>
                        <td class="fw-medium">${parseFloat(order.total).toFixed(2)} MAD</td>
                        <td>
                            <span class="badge ${this.getStatusClass(order.statut)}">
                                ${this.getStatusText(order.statut)}
                            </span>
                        </td>
                        <td>
                            <span class="badge bg-primary">${order.items ? order.items.length : 0}</span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-sm btn-outline-primary btn-action" 
                                        onclick="adminPanel.viewOrderDetails(${order.id})" title="Voir détails">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-success btn-action" 
                                        onclick="adminPanel.quickUpdateStatus(${order.id}, 'confirmee')" title="Confirmer">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-action" 
                                        onclick="adminPanel.deleteOrder(${order.id})" title="Supprimer">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            this.allOrders = orders; // Stocker pour le filtrage
            this.hideLoading();
        } catch (error) {
            console.error('Erreur chargement commandes:', error);
            this.showToast('Erreur', 'Impossible de charger les commandes', 'error');
            this.hideLoading();
        }
    }

    calculateOrderStats(orders) {
        return {
            pending: orders.filter(o => o.statut === 'en_attente').length,
            confirmed: orders.filter(o => o.statut === 'validee').length,
            shipped: orders.filter(o => o.statut === 'livree').length,
            delivered: orders.filter(o => o.statut === 'livree').length
        };
    }

    getStatusClass(status) {
        const classes = {
            'en_attente': 'bg-warning text-dark',
            'validee': 'bg-info text-white',
            'livree': 'bg-success text-white',
            'annulee': 'bg-danger text-white'
        };
        return classes[status] || 'bg-secondary text-white';
    }

    getStatusText(status) {
        const texts = {
            'en_attente': 'En attente',
            'validee': 'Validée',
            'livree': 'Livrée',
            'annulee': 'Annulée'
        };
        return texts[status] || status;
    }

    async viewOrderDetails(orderId) {
        try {
            // Charger les détails depuis l'API
            const response = await this.fetchData(`/orders/admin/${orderId}`);
            const order = response.order;
            
            if (!order) {
                this.showToast('Erreur', 'Commande non trouvée', 'error');
                return;
            }

            // Remplir le modal avec les détails
            document.getElementById('orderNumber').textContent = order.id;
            document.getElementById('customerName').textContent = order.user_name;
            document.getElementById('customerEmail').textContent = order.user_email;
            document.getElementById('customerPhone').textContent = order.user_phone || 'Non renseigné';
            document.getElementById('orderDate').textContent = new Date(order.created_at).toLocaleString('fr-FR');
            document.getElementById('orderStatus').innerHTML = `<span class="badge ${this.getStatusClass(order.statut)}">${this.getStatusText(order.statut)}</span>`;
            document.getElementById('orderTotal').textContent = parseFloat(order.total).toFixed(2) + ' MAD';
            document.getElementById('deliveryAddress').textContent = order.adresse_livraison;
            document.getElementById('newOrderStatus').value = order.statut;

            // Remplir les articles
            const itemsTable = document.getElementById('orderItems');
            itemsTable.innerHTML = '';
            
            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    const row = document.createElement('tr');
                    const prixUnitaire = parseFloat(item.prix || 0);
                    const quantite = parseInt(item.quantite || 0);
                    const total = prixUnitaire * quantite;
                    
                    row.innerHTML = `
                        <td>${item.product_name}</td>
                        <td>${prixUnitaire.toFixed(2)} MAD</td>
                        <td>${quantite}</td>
                        <td>${total.toFixed(2)} MAD</td>
                    `;
                    itemsTable.appendChild(row);
                });
            }

            // Stocker l'ID de la commande pour les actions
            this.currentOrderId = orderId;

            // Afficher le modal
            new bootstrap.Modal(document.getElementById('orderDetailModal')).show();
        } catch (error) {
            console.error('Erreur affichage détails commande:', error);
            this.showToast('Erreur', 'Impossible d\'afficher les détails', 'error');
        }
    }

    async updateOrderStatus() {
        try {
            const newStatus = document.getElementById('newOrderStatus').value;
            
            if (!this.currentOrderId || !newStatus) {
                this.showToast('Erreur', 'Données manquantes', 'error');
                return;
            }

            this.showLoading();

            const response = await fetch(`${this.apiUrl}/orders/admin/${this.currentOrderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ statut: newStatus })
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Succès', 'Statut mis à jour avec succès', 'success');
                bootstrap.Modal.getInstance(document.getElementById('orderDetailModal')).hide();
                this.loadOrders();
            } else {
                this.showToast('Erreur', result.message || 'Erreur lors de la mise à jour', 'error');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Erreur mise à jour statut:', error);
            this.showToast('Erreur', 'Erreur lors de la mise à jour', 'error');
            this.hideLoading();
        }
    }

    async quickUpdateStatus(orderId, newStatus) {
        try {
            this.showLoading();

            const response = await fetch(`${this.apiUrl}/orders/admin/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ statut: newStatus })
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Succès', 'Commande validée', 'success');
                this.loadOrders();
            } else {
                this.showToast('Erreur', result.message || 'Erreur lors de la validation', 'error');
            }

            this.hideLoading();
        } catch (error) {
            console.error('Erreur validation commande:', error);
            this.showToast('Erreur', 'Erreur lors de la validation', 'error');
            this.hideLoading();
        }
    }

    async deleteOrder(orderId = null) {
        const id = orderId || this.currentOrderId;
        
        if (!id) {
            this.showToast('Erreur', 'ID de commande manquant', 'error');
            return;
        }

        if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            try {
                this.showLoading();

                const response = await fetch(`${this.apiUrl}/orders/admin/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.showToast('Succès', 'Commande supprimée avec succès', 'success');
                    
                    if (document.getElementById('orderDetailModal').classList.contains('show')) {
                        bootstrap.Modal.getInstance(document.getElementById('orderDetailModal')).hide();
                    }
                    
                    this.loadOrders();
                } else {
                    this.showToast('Erreur', result.message || 'Erreur lors de la suppression', 'error');
                }

                this.hideLoading();
            } catch (error) {
                console.error('Erreur suppression commande:', error);
                this.showToast('Erreur', 'Erreur lors de la suppression', 'error');
                this.hideLoading();
            }
        }
    }

    filterOrders(status) {
        const rows = document.querySelectorAll('#ordersTable tr');
        rows.forEach(row => {
            if (!status) {
                row.style.display = '';
            } else {
                const statusBadge = row.querySelector('.status-badge');
                const orderStatus = statusBadge ? statusBadge.textContent.trim() : '';
                const statusText = this.getStatusText(status);
                
                if (orderStatus === statusText) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    searchOrders(query) {
        const rows = document.querySelectorAll('#ordersTable tr');
        rows.forEach(row => {
            const orderNumber = row.querySelector('td:nth-child(1)')?.textContent.toLowerCase();
            const customerName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase();
            
            if ((orderNumber && orderNumber.includes(query.toLowerCase())) ||
                (customerName && customerName.includes(query.toLowerCase()))) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    async fetchData(endpoint) {
        const response = await fetch(`${this.apiUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showToast(title, message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Remove existing classes
        toast.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning', 'text-bg-info');
        
        // Add appropriate class based on type
        switch(type) {
            case 'success':
                toast.classList.add('text-bg-success');
                break;
            case 'error':
                toast.classList.add('text-bg-danger');
                break;
            case 'warning':
                toast.classList.add('text-bg-warning');
                break;
            default:
                toast.classList.add('text-bg-info');
        }

        new bootstrap.Toast(toast).show();
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Reset modals when hidden
document.getElementById('productModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalTitle').textContent = 'Ajouter un produit';
    document.getElementById('imagePreview').style.display = 'none';
    // Reset checkboxes
    document.getElementById('isBestseller').checked = false;
    document.getElementById('isNew').checked = false;
    document.getElementById('isFeatured').checked = false;
});

document.getElementById('categoryModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModalTitle').textContent = 'Ajouter une catégorie';
});

document.getElementById('brandModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('brandForm').reset();
    document.getElementById('brandId').value = '';
    document.getElementById('brandModalTitle').textContent = 'Ajouter une marque';
    document.getElementById('logoPreview').style.display = 'none';
});