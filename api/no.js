const { success, error, handleCors } = require('../lib/response');
const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  try {
    const { count, error: countError } = await supabase
      .from('no_reasons')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;
    if (!count) return error(res, 'No reasons found.', 404);

    const offset = Math.floor(Math.random() * count);

    const { data, error: fetchError } = await supabase
      .from('no_reasons')
      .select('reason')
      .range(offset, offset)
      .single();

    if (fetchError) throw fetchError;

    return success(res, { reason: data.reason });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch a reason. Please try again.', 502);
  }
};
