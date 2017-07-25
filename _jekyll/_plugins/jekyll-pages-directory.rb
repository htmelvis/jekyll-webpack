module Jekyll
  class PagesDirGenerator < Generator
    priority :highest
    def generate(site)
      Jekyll.logger.info "Pages", 'Creating pages directory'
      pages = '_pages'
      pages_dir = site.config['pages'] || '_jekyll/_pages'
      all_raw_paths = Dir["#{pages_dir}/**/*"]
      all_raw_paths.each do |f|
        if File.file?(f)
          filename = f.match(/[^\/]*$/)[0]
          clean_filepath = f.gsub(/^#{pages_dir}\//, '')
          clean_dir = extract_directory(clean_filepath)
          #binding.pry
          site.pages << PagesDirPage.new(site,
                                         site.source,
                                         clean_dir,
                                         filename,
                                         pages)


        end
      end
    end

    def extract_directory(filepath)
      dir_match = filepath.match(/(.*\/)[^\/]*$/)
      if dir_match
        return dir_match[1]
      else
        return ''
      end
    end

  end


  class PagesDirPage < Page

    def initialize(site, base, dir, name, pagesdir)
      @site = site
      @base = base
      @dir = dir
      @name = name
      process(name)

      read_yaml(File.join(base, pagesdir, dir), name)
    end

  end


end
