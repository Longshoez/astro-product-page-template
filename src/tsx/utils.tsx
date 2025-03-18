/**
 * Convierte un texto en un formato URL amigable (slug)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Formatea una fecha en formato de EE.UU.
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    timeZone: "UTC",
  });
}

/**
 * Interfaz para un post de blog
 */
interface BlogPost {
  frontmatter: {
    date: string;
    draft?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Opciones para filtrar y ordenar posts
 */
interface FormatBlogPostsOptions {
  filterOutDrafts?: boolean;
  filterOutFuturePosts?: boolean;
  sortByDate?: boolean;
  limit?: number;
}

/**
 * Filtra y ordena posts de blog según las opciones especificadas
 */
export function formatBlogPosts(
  posts: BlogPost[],
  {
    filterOutDrafts = true,
    filterOutFuturePosts = true,
    sortByDate = true,
    limit = undefined,
  }: FormatBlogPostsOptions = {}
): BlogPost[] {
  const filteredPosts = posts.reduce<BlogPost[]>((acc, post) => {
    const { date, draft } = post.frontmatter;

    // filterOutDrafts if true
    if (filterOutDrafts && draft) return acc;

    // filterOutFuturePosts if true
    if (filterOutFuturePosts && new Date(date) > new Date()) return acc;

    // add post to acc
    acc.push(post);
    return acc;
  }, []);

  // sortByDate or randomize
  if (sortByDate) {
    filteredPosts.sort((a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
  } else {
    filteredPosts.sort(() => Math.random() - 0.5);
  }

  // limit if number is passed
  if (typeof limit === "number") {
    return filteredPosts.slice(0, limit);
  }

  return filteredPosts;
}
