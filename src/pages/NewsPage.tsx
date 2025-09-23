import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Calendar, User, Eye, Code, Type } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormOperations } from '@/hooks/use-form-operations';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ReactQuill from 'react-quill';
import HtmlEditor from '@/components/ui/html-editor';
import 'react-quill/dist/quill.snow.css';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published';
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

const initialFormValues = {
  title: '',
  content: '',
  excerpt: '',
  category: '',
  status: 'draft' as const
};

const categories = [
  { value: 'agriculture', label: 'Nông nghiệp' },
  { value: 'technology', label: 'Công nghệ' },
  { value: 'market', label: 'Thị trường' },
  { value: 'environment', label: 'Môi trường' },
  { value: 'policy', label: 'Chính sách' },
  { value: 'education', label: 'Đào tạo' }
];

const NewsPage = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'Kỹ thuật trồng cà chua công nghệ cao',
      content: 'Nội dung chi tiết về kỹ thuật trồng cà chua sử dụng công nghệ hiện đại...',
      excerpt: 'Hướng dẫn chi tiết về cách áp dụng công nghệ cao trong trồng cà chua',
      category: 'technology',
      status: 'published',
      author: 'Nguyễn Văn A',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      views: 156
    },
    {
      id: '2',
      title: 'Thị trường nông sản tháng 1/2024',
      content: 'Phân tích tình hình thị trường nông sản trong tháng đầu năm...',
      excerpt: 'Tổng quan về xu hướng giá cả và nhu cầu thị trường nông sản',
      category: 'market',
      status: 'published',
      author: 'Trần Thị B',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      views: 89
    },
    {
      id: '3',
      title: 'Hợp tác nông nghiệp: mô hình hợp tác xã bền vững',
      content: 'Một phân tích về mô hình hợp tác xã giúp nông dân tối ưu hóa đầu ra...',
      excerpt: 'Lợi ích và thách thức khi xây dựng hợp tác xã nông nghiệp',
      category: 'policy',
      status: 'published',
      author: 'Lê Thị C',
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05'),
      views: 72
    },
    {
      id: '4',
      title: 'Ứng dụng cảm biến đất cho tưới tiêu chính xác',
      content: 'Sử dụng cảm biến độ ẩm và dữ liệu khí hậu để tối ưu hóa lịch tưới...',
      excerpt: 'Hướng dẫn triển khai cảm biến đất để tiết kiệm nước và tăng năng suất',
      category: 'technology',
      status: 'draft',
      author: 'Pham Nguyen',
      createdAt: new Date('2024-03-12'),
      updatedAt: new Date('2024-03-12'),
      views: 12
    },
    {
      id: '5',
      title: 'Biến đổi khí hậu và ảnh hưởng đến mùa vụ',
      content: 'Nghiên cứu mới nhất về xu hướng lượng mưa và nhiệt độ ảnh hưởng đến sản xuất nông nghiệp...',
      excerpt: 'Tổng hợp dữ liệu khí hậu và lời khuyên cho nhà nông',
      category: 'environment',
      status: 'published',
      author: 'Ngô Văn D',
      createdAt: new Date('2024-04-02'),
      updatedAt: new Date('2024-04-05'),
      views: 204
    },
    {
      id: '6',
      title: 'Khóa đào tạo kỹ thuật canh tác hữu cơ',
      content: 'Chi tiết về chương trình đào tạo cơ bản và nâng cao trong canh tác hữu cơ...',
      excerpt: 'Thông tin và lịch khai giảng các khóa đào tạo canh tác hữu cơ',
      category: 'education',
      status: 'published',
      author: 'Trần Hoàng',
      createdAt: new Date('2024-05-20'),
      updatedAt: new Date('2024-05-21'),
      views: 47
    },
    {
      id: '7',
      title: 'Giá phân bón tăng: mẹo giảm chi phí cho nông dân',
      content: 'Biện pháp thay thế và cân đối dinh dưỡng cây trồng khi giá phân bón tăng cao...',
      excerpt: 'Chiến lược giảm chi phí phân bón mà vẫn giữ năng suất',
      category: 'market',
      status: 'draft',
      author: 'Bùi Thị E',
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-06-01'),
      views: 5
    },
    {
      id: '8',
      title: 'Sử dụng drone để giám sát sâu bệnh',
      content: 'Cách triển khai drone để thu thập hình ảnh NDVI và phát hiện sớm sâu bệnh...',
      excerpt: 'Hướng dẫn ứng dụng drone và xử lý hình ảnh cho phát hiện dịch bệnh',
      category: 'technology',
      status: 'published',
      author: 'Hoàng Minh',
      createdAt: new Date('2024-07-10'),
      updatedAt: new Date('2024-07-11'),
      views: 131
    },
    {
      id: '9',
      title: 'Thúc đẩy tiêu thụ sản phẩm địa phương',
      content: 'Chiến dịch marketing địa phương giúp gia tăng tiêu thụ nông sản...',
      excerpt: 'Các sáng kiến thúc đẩy tiêu thụ sản phẩm nông nghiệp địa phương',
      category: 'market',
      status: 'published',
      author: 'Nguyễn Hương',
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-08-02'),
      views: 64
    },
    {
      id: '10',
      title: 'Quản lý sâu bệnh hữu cơ cho vườn trái cây',
      content: 'Các phương pháp quản lý sâu bệnh không dùng hóa chất cho vườn cây ăn trái...',
      excerpt: 'Kỹ thuật sinh học và bẫy sinh học để kiểm soát sâu bệnh',
      category: 'environment',
      status: 'draft',
      author: 'Lâm Quốc',
      createdAt: new Date('2024-08-20'),
      updatedAt: new Date('2024-08-20'),
      views: 3
    }
  ]);

  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue
  } = useFormOperations(initialFormValues, {
    title: { required: true, minLength: 5, maxLength: 200 },
    content: { required: true, minLength: 50 },
    excerpt: { required: true, maxLength: 300 },
    category: { required: true }
  });

  // ReactQuill modules and formats configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ],
  }), []);

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'script', 'direction'
  ];

  const handleSaveArticle = async (formData: typeof initialFormValues) => {
    try {
      const now = new Date();
      
      if (selectedArticle) {
        // Edit existing article
        setArticles(prev => prev.map(article => 
          article.id === selectedArticle.id 
            ? { 
                ...article, 
                ...formData, 
                updatedAt: now 
              }
            : article
        ));
        toast.success("Bài viết đã được cập nhật");
      } else {
        // Create new article
        const newArticle: NewsArticle = {
          id: Date.now().toString(),
          ...formData,
          author: "Người dùng hiện tại",
          createdAt: now,
          updatedAt: now,
          views: 0
        };
        setArticles(prev => [newArticle, ...prev]);
        toast.success("Bài viết đã được tạo thành công");
      }
      
      handleCloseDialog();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu bài viết");
    }
  };

  const handleEditArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setFieldValue('title', article.title);
    setFieldValue('content', article.content);
    setFieldValue('excerpt', article.excerpt);
    setFieldValue('category', article.category);
    setFieldValue('status', article.status);
    setIsDialogOpen(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(article => article.id !== articleId));
    toast.success("Bài viết đã được xóa");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedArticle(null);
    setIsHtmlMode(false);
    resetForm();
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(cat => cat.value === value)?.label || value;
  };

  const filteredArticles = articles.filter(article => {
    const categoryMatch = filterCategory === 'all' || article.category === filterCategory;
    const statusMatch = filterStatus === 'all' || article.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));

  // Ensure currentPage is in range when filters or pageSize change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterStatus, pageSize]);

  const pagedArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <PageLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quản lý Tin tức</h1>
              <p className="text-muted-foreground">Tạo và quản lý các bài viết tin tức</p>
            </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Thêm bài viết
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedArticle ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(handleSaveArticle)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">{errors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Danh mục *</Label>
                    <Select
                      value={values.category}
                      onValueChange={(value) => setFieldValue('category', value)}
                    >
                      <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive mt-1">{errors.category}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={values.status}
                      onValueChange={(value) => setFieldValue('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                        <SelectItem value="published">Đã xuất bản</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="excerpt">Tóm tắt *</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={values.excerpt}
                      onChange={handleChange}
                      rows={3}
                      className={errors.excerpt ? 'border-destructive' : ''}
                      placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                    />
                    {errors.excerpt && (
                      <p className="text-sm text-destructive mt-1">{errors.excerpt}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="content">Nội dung *</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={!isHtmlMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsHtmlMode(false)}
                        >
                          <Type className="w-4 h-4 mr-1" />
                          Visual
                        </Button>
                        <Button
                          type="button"
                          variant={isHtmlMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsHtmlMode(true)}
                        >
                          <Code className="w-4 h-4 mr-1" />
                          HTML
                        </Button>
                      </div>
                    </div>
                    
                    {isHtmlMode ? (
                      <HtmlEditor
                        value={values.content}
                        onChange={(content) => setFieldValue("content", content)}
                        rows={15}
                        error={!!errors.content}
                        placeholder="Nhập HTML code..."
                      />
                    ) : (
                      <div className={`border rounded-md ${errors.content ? "border-destructive" : "border-input"}`}>
                        <ReactQuill
                          theme="snow"
                          value={values.content}
                          onChange={(content) => setFieldValue("content", content)}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="Nhập nội dung chi tiết của bài viết..."
                          style={{ minHeight: "200px" }}
                        />
                      </div>
                    )}
                    
                    {errors.content && (
                      <p className="text-sm text-destructive mt-1">{errors.content}</p>
                    )}
                    
                    {isHtmlMode && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Chế độ HTML: Bạn có thể chỉnh sửa trực tiếp mã HTML. Hãy cẩn thận với cú pháp.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Đang lưu..." : selectedArticle ? "Cập nhật" : "Tạo bài viết"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="filter-category">Lọc theo danh mục</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="filter-status">Lọc theo trạng thái</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="grid gap-6">
          {pagedArticles.length === 0 ? (
            <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Chưa có bài viết nào</p>
                </CardContent>
            </Card>
          ) : (
            pagedArticles.map(article => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                      <div 
                        className="text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: article.excerpt }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditArticle(article)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant={article.status === "published" ? "default" : "secondary"}>
                        {article.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryLabel(article.category)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(article.createdAt, "dd/MM/yyyy", { locale: vi })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views} lượt xem</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-8 px-2 border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-muted-foreground">bài / trang</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              {'<<'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>

            {/* Page numbers (compact) */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              // compact display: show first, last, current +/-2
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              }
              // render ellipsis once when crossing ranges
              const shouldRenderEllipsis = page === currentPage - 3 || page === currentPage + 3;
              return shouldRenderEllipsis ? (
                <span key={`dot-${page}`} className="px-2">...</span>
              ) : null;
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NewsPage;