<?php defined('SYSPATH') or die('No direct script access.');

class Model_Share extends Model_Common {

	/**
	 * Список дисциплин
	 * @return mixed
	 */
	public function get_disciplines_titles ()
	{
		$query = DB::select(
			'url',
			'title'
		)
			->from($this->table_disciplines);

		$cache = Functions::cache_instance();
		$cache_key = md5($query);

		if (($result = $cache->get($cache_key)) === NULL)
		{
			$result = $query
				->execute()
				->as_array('url', 'title');

			$cache->set_with_tags($cache_key, $result, NULL, array('table_'.$this->table_disciplines));
		}

		return $result;
	}
	
	/**
	 * Существование дисциплины по url
	 * @param $url
	 * @return bool
	 */
	public function check_discipline_url ($url)
	{
		$query = DB::select(array(DB::expr('COUNT(*)'), 'total'))
			->from($this->table_disciplines)
			->where('url', '=', $url);

		$cache = Functions::cache_instance();
		$cache_key = md5($query);

		if (($count = $cache->get($cache_key)) === NULL)
		{
			$count = $query
				->execute()
				->get('total');

			$cache->set_with_tags($cache_key, $count, NULL, array('table_'.$this->table_disciplines));
		}

		return (bool) $count;
	}

	/**
	 * Проверка временного ограничения на генерацию изображения по ip-адресу
	 * @param $type
	 * @return bool
	 * @throws Kohana_Exception
	 */
	public function is_time_remaining_create_image ($type)
	{
		return ! DB::select(array(DB::expr('COUNT(*)'), 'count'))
			->from($this->table_gd_generation_timings)
			->where('type', '=', $type)
			->and_where('ip', '=', Functions::ip())
			->and_where('created_at', '>', time() - Kohana::$config->load('options.generate_gd_image_time_limit'))
			->execute()
			->get('count');
	}

	/**
	 * Внесение временного ограничения на генерацию изображения по ip-адресу
	 * @param $type
	 * @throws Kohana_Exception
	 */
	public function set_time_remaining_create_image ($type)
	{
		DB::insert($this->table_gd_generation_timings, array('type' ,'created_at', 'ip'))
			->values(array(
				$type,
				time(),
				Functions::ip()
			))
			->execute();
	}

}